import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import {
	agentSkillNames,
	corsDiscoveryPaths,
	fetchWithoutRedirect,
	parseLinkHeader,
	publicHtmlPaths,
	siteUrl,
	startProductionServer
} from './site-fixture.mjs';

let server;

async function getJson(path, expectedType) {
	const response = await fetchWithoutRedirect(server.baseUrl, path);
	assert.equal(response.status, 200, `${path} should return HTTP 200`);
	assert.equal(
		(response.headers.get('content-type') ?? '').split(';')[0].trim(),
		expectedType,
		`${path} should be served as ${expectedType}`
	);

	const body = await response.text();
	let parsed;
	assert.doesNotThrow(() => {
		parsed = JSON.parse(body);
	}, `${path} should be valid JSON`);

	return { response, body, json: parsed };
}

/** Fetches a URL this site published about itself, asserting it resolves here. */
async function resolvePublishedUrl(url, label) {
	assert.ok(url.startsWith(`${siteUrl}/`), `${label} should be an absolute canonical URL: ${url}`);
	const response = await fetchWithoutRedirect(server.baseUrl, url.slice(siteUrl.length));
	assert.equal(response.status, 200, `${label} points at ${url}, which does not answer`);
	return response;
}

before(async () => {
	server = await startProductionServer();
});

after(async () => {
	await server?.close();
});

describe('RFC 8288 discovery link headers', () => {
	// `canonical`, `alternate`, `service-doc`, `index`, their ordering ahead of the preload
	// hints, and the 404 case are covered in production.test.mjs. These are the relations
	// that could not be published until the documents behind them existed.
	const published = {
		'api-catalog': ['/.well-known/api-catalog', 'application/linkset+json'],
		'service-desc': ['/openapi.json', 'application/openapi+json'],
		'service-meta': ['/.well-known/ai-catalog.json', 'application/json'],
		describedby: ['/.well-known/agent-skills/index.json', 'application/json'],
		status: ['/health', 'application/health+json']
	};

	it('points agents at every document this change publishes, and serves each one', async () => {
		const response = await fetchWithoutRedirect(server.baseUrl, '/');
		const links = parseLinkHeader(response.headers.get('link'));

		for (const [rel, [path, type]] of Object.entries(published)) {
			const matching = links.filter((link) => link.rel === rel);
			assert.deepEqual(
				matching.map((link) => [link.target, link.type]),
				[[`${siteUrl}${path}`, type]],
				`the home page should publish one rel="${rel}" link, typed`
			);

			// A relation is a promise a client will try to collect on. An entry that 404s is
			// worse than an absent one, because it also teaches the client to stop following.
			await resolvePublishedUrl(matching[0].target, `rel="${rel}"`);
		}
	});

	it('carries them into the markdown representation, which has no head to put them in', async () => {
		const response = await fetch(`${server.baseUrl}/about`, {
			headers: { accept: 'text/markdown' },
			redirect: 'manual'
		});
		const links = parseLinkHeader(response.headers.get('link'));

		assert.match(response.headers.get('content-type') ?? '', /^text\/markdown\b/);
		for (const [rel, [path]] of Object.entries(published)) {
			assert.deepEqual(
				links.filter((link) => link.rel === rel).map((link) => link.target),
				[`${siteUrl}${path}`],
				`the markdown representation should keep rel="${rel}"`
			);
		}
	});

	it('leaves the page relations off documents that are not pages', async () => {
		// `/auth.md` and a SKILL.md are markdown, but they are destinations rather than one
		// representation of a page: there is no HTML twin and no alternate to advertise.
		for (const path of [
			'/auth.md',
			'/openapi.json',
			`/.well-known/agent-skills/${agentSkillNames[0]}/SKILL.md`
		]) {
			const response = await fetchWithoutRedirect(server.baseUrl, path);
			assert.equal(response.headers.get('link'), null, `${path} should not carry page relations`);
		}
	});
});

describe('RFC 9727 API catalog', () => {
	it('describes the one API this origin serves, and nothing it does not', async () => {
		const { json } = await getJson('/.well-known/api-catalog', 'application/linkset+json');

		assert.ok(Array.isArray(json.linkset) && json.linkset.length > 0, 'linkset array');

		const [catalog, api] = json.linkset;
		assert.equal(catalog.anchor, `${siteUrl}/.well-known/api-catalog`);
		assert.ok(Array.isArray(catalog.item) && catalog.item.length > 0, 'catalog should list items');
		for (const item of catalog.item) {
			assert.equal(item.href, api.anchor, 'each item should anchor an object in the same set');
		}

		// Every relation the catalog claims has to resolve. A catalog is a list of promises a
		// client will try to collect on, so an entry that 404s is worse than an absent one.
		for (const relation of [
			'service-desc',
			'service-doc',
			'service-meta',
			'status',
			'describedby'
		]) {
			const [link] = api[relation] ?? [];
			assert.ok(link?.href, `the API should publish a ${relation} link`);
			assert.ok(link.title, `${relation} should carry a title`);
			await resolvePublishedUrl(link.href, `api-catalog ${relation}`);
		}
	});
});

describe('ARD capability manifest', () => {
	it('publishes entries a registry can index, each pointing at something real', async () => {
		const { json } = await getJson('/.well-known/ai-catalog.json', 'application/json');

		assert.equal(typeof json.specVersion, 'string');
		assert.ok(json.specVersion.length > 0, 'specVersion should not be empty');
		assert.equal(json.host.identifier, 'h2technologiesllc.com');
		assert.ok(json.host.displayName, 'host should have a display name');
		assert.ok(Array.isArray(json.entries) && json.entries.length > 0, 'entries array');

		const identifiers = new Set();
		for (const entry of json.entries) {
			assert.match(
				entry.identifier,
				/^urn:air:h2technologiesllc\.com:[a-z0-9-]+:[a-z0-9-]+$/,
				`${entry.identifier} should be a urn:air identifier under this domain`
			);
			assert.ok(!identifiers.has(entry.identifier), `${entry.identifier} is listed twice`);
			identifiers.add(entry.identifier);

			assert.ok(entry.displayName, `${entry.identifier} needs a display name`);
			assert.match(entry.type, /^[a-z]+\/[a-z0-9.+-]+$/, `${entry.identifier} needs a media type`);

			// Exactly one of `url` or `data`: an entry with both says two different things
			// about where the resource is, and an entry with neither says nothing at all.
			assert.equal(
				Number(entry.url !== undefined) + Number(entry.data !== undefined),
				1,
				`${entry.identifier} should carry exactly one of url or data`
			);

			assert.ok(
				entry.representativeQueries.length >= 2 && entry.representativeQueries.length <= 5,
				`${entry.identifier} should carry 2-5 representative queries`
			);
		}
	});

	it('resolves every entry it advertises on this origin', async () => {
		const { json } = await getJson('/.well-known/ai-catalog.json', 'application/json');

		for (const entry of json.entries) {
			await resolvePublishedUrl(entry.url, `ai-catalog entry ${entry.identifier}`);
		}
	});

	it('is pointed at from robots.txt and from the page itself', async () => {
		const robots = await (await fetchWithoutRedirect(server.baseUrl, '/robots.txt')).text();

		// Commented rather than live: `agentmap` is not on Lighthouse's directive safelist,
		// so an active line here fails the `robots-txt` audit on every page. See the comment
		// in `src/routes/robots.txt/+server.ts` for the trade. Asserted in its commented form
		// so that uncommenting it is a deliberate edit to this test as well.
		assert.match(
			robots,
			new RegExp(`^# Agentmap: ${siteUrl}/\\.well-known/ai-catalog\\.json$`, 'm')
		);

		const home = await (await fetchWithoutRedirect(server.baseUrl, '/')).text();
		assert.match(home, /<link rel="ai-catalog" href="\/\.well-known\/ai-catalog\.json"\s*\/?>/);
	});
});

describe('agent skills discovery', () => {
	it('indexes every published skill with a digest of the bytes it serves', async () => {
		const { json } = await getJson('/.well-known/agent-skills/index.json', 'application/json');

		assert.equal(json.$schema, 'https://schemas.agentskills.io/discovery/0.2.0/schema.json');
		assert.deepEqual(
			json.skills.map((skill) => skill.name),
			agentSkillNames
		);

		for (const skill of json.skills) {
			assert.equal(skill.type, 'skill-md');
			assert.ok(skill.description.length > 30, `${skill.name} needs a real description`);
			assert.match(skill.digest, /^sha256:[a-f0-9]{64}$/, `${skill.name} digest format`);

			const response = await resolvePublishedUrl(skill.url, `skill ${skill.name}`);
			assert.match(response.headers.get('content-type') ?? '', /^text\/markdown\b/);

			const body = await response.text();
			// The digest is only worth publishing if it describes what the URL actually
			// returns. Computing it here from the served bytes is the whole test.
			assert.equal(
				`sha256:${createHash('sha256').update(body, 'utf8').digest('hex')}`,
				skill.digest,
				`${skill.name} digest should match the SKILL.md it points at`
			);

			assert.match(body, /^---\nname: /, `${skill.name} should open with skill frontmatter`);
			assert.match(body, new RegExp(`^name: ${skill.name}$`, 'm'));
		}
	});

	it('404s a skill it never published rather than serving an empty one', async () => {
		const response = await fetchWithoutRedirect(
			server.baseUrl,
			'/.well-known/agent-skills/not-a-skill/SKILL.md'
		);
		assert.equal(response.status, 404);
	});
});

describe('agent authentication policy', () => {
	it('answers the authentication question in one fetch', async () => {
		const response = await fetchWithoutRedirect(server.baseUrl, '/auth.md');
		const body = await response.text();

		assert.equal(response.status, 200);
		assert.match(response.headers.get('content-type') ?? '', /^text\/markdown\b/);
		assert.match(body, /^# auth\.md$/m, 'auth.md is identified by its H1');

		// The answer this site actually gives, stated rather than implied: there is nothing
		// to authenticate to, so an agent can stop looking instead of probing for a flow.
		assert.match(body, /\*\*None\.\*\*/);
		assert.match(body, /oauth-protected-resource/);
	});

	it('does not publish OAuth metadata for authorization servers it does not run', async () => {
		// Publishing either of these would describe a gate this origin has no code for, and
		// every agent that believed it would be worse off than one that read `/auth.md`.
		for (const path of [
			'/.well-known/oauth-protected-resource',
			'/.well-known/oauth-authorization-server',
			'/.well-known/openid-configuration'
		]) {
			const response = await fetchWithoutRedirect(server.baseUrl, path);
			assert.equal(response.status, 404, `${path} should not exist while there is no auth`);
		}
	});
});

describe('OpenAPI description', () => {
	it('describes the real endpoints, including the slugs each collection answers', async () => {
		const { json } = await getJson('/openapi.json', 'application/openapi+json');

		assert.match(json.openapi, /^3\.1\./);
		assert.equal(json.servers[0].url, siteUrl);

		for (const path of ['/', '/contact', '/llms.txt', '/health', '/.well-known/api-catalog']) {
			assert.ok(json.paths[path], `openapi.json should describe ${path}`);
		}

		// Enumerating the slugs is what makes this document worth fetching: a client knows
		// which URLs exist without crawling. The enumeration has to match the live routes.
		for (const [template, prefix] of [
			['/services/{slug}', '/services/'],
			['/locations/{slug}', '/locations/'],
			['/resources/{slug}', '/resources/']
		]) {
			const parameter = json.paths[template].get.parameters.find((p) => p.name === 'slug');
			const published = publicHtmlPaths
				.filter((path) => path.startsWith(prefix))
				.map((path) => path.slice(prefix.length));

			assert.deepEqual(parameter.schema.enum, published, `${template} should list every slug`);
		}
	});

	it('offers no operation this origin does not answer', async () => {
		const { json } = await getJson('/openapi.json', 'application/openapi+json');

		for (const [path, item] of Object.entries(json.paths)) {
			assert.deepEqual(
				Object.keys(item),
				['get'],
				`${path} should describe a GET and nothing else: this site has no write surface`
			);
		}
	});
});

describe('origin health', () => {
	it('answers in the health+json shape, uncached', async () => {
		const { json, response } = await getJson('/health', 'application/health+json');

		assert.equal(json.status, 'pass');
		assert.equal(json.serviceId, 'h2technologiesllc.com');
		// A cached health response describes the moment it was stored, not the origin now.
		assert.equal(response.headers.get('cache-control'), 'no-store');
	});

	it('publishes no build or version identifier', async () => {
		const { body } = await getJson('/health', 'application/health+json');
		assert.doesNotMatch(body, /\d+\.\d+\.\d+/, 'a version here only helps someone probing');
	});
});

describe('cross-origin readability', () => {
	it('lets a browser-based agent read every discovery document', async () => {
		for (const path of corsDiscoveryPaths) {
			const response = await fetchWithoutRedirect(server.baseUrl, path);
			assert.equal(
				response.headers.get('access-control-allow-origin'),
				'*',
				`${path} is unreadable from a page on another origin without CORS`
			);
		}
	});

	it('keeps the pages themselves same-origin', async () => {
		// The documents above are metadata and identical for every requester. A page is the
		// product, and nothing about agent discovery requires opening it up.
		const response = await fetchWithoutRedirect(server.baseUrl, '/');
		assert.equal(response.headers.get('access-control-allow-origin'), null);
	});
});
