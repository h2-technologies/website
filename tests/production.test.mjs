import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { after, before, describe, it } from 'node:test';
import {
	expectedSitemapUrls,
	fetchWithoutRedirect,
	publicHtmlPaths,
	siteUrl,
	startProductionServer
} from './site-fixture.mjs';

let server;

function escapeRegex(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function attribute(html, elementPattern, attributeName) {
	const openingTag = html.match(elementPattern)?.[0];
	return openingTag?.match(new RegExp(`\\b${attributeName}="([^"]*)"`, 'i'))?.[1];
}

function metaContent(html, attributeName, attributeValue) {
	const escapedValue = escapeRegex(attributeValue);
	const matchingTag = html.match(
		new RegExp(`<meta\\b(?=[^>]*\\b${attributeName}="${escapedValue}")[^>]*>`, 'i')
	)?.[0];
	return matchingTag?.match(/\bcontent="([^"]*)"/i)?.[1];
}

function linkHref(html, rel) {
	const matchingTag = html.match(
		new RegExp(`<link\\b(?=[^>]*\\brel="${escapeRegex(rel)}")[^>]*>`, 'i')
	)?.[0];
	return matchingTag?.match(/\bhref="([^"]*)"/i)?.[1];
}

function allMatches(html, expression) {
	return [...html.matchAll(expression)].map((match) => match[1]);
}

function cspDirective(policy, name) {
	const directive = policy
		.split(';')
		.map((value) => value.trim().split(/\s+/))
		.find(([directiveName]) => directiveName === name);
	return directive?.slice(1) ?? [];
}

function parseJsonLd(html, path) {
	const blocks = allMatches(
		html,
		/<script\b(?=[^>]*\btype="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi
	);
	assert.ok(blocks.length > 0, `${path} should include JSON-LD`);

	return blocks.map((block, index) => {
		assert.doesNotThrow(
			() => JSON.parse(block),
			`${path} JSON-LD block ${index + 1} should be valid JSON`
		);
		return JSON.parse(block);
	});
}

function assertDirectSuccess(response, path) {
	assert.equal(response.status, 200, `${path} should return HTTP 200 without redirecting`);
	assert.equal(response.headers.get('location'), null, `${path} should not redirect`);
}

async function getHtml(path) {
	const response = await fetchWithoutRedirect(server.baseUrl, path);
	assertDirectSuccess(response, path);
	assert.match(response.headers.get('content-type') ?? '', /^text\/html\b/i);
	return { response, html: await response.text() };
}

before(async () => {
	server = await startProductionServer();
});

after(async () => {
	await server?.close();
});

describe('crawler-facing production routes', () => {
	it('serves an explicit, indexable robots.txt with the canonical sitemap', async () => {
		const response = await fetchWithoutRedirect(server.baseUrl, '/robots.txt');
		const body = await response.text();

		assertDirectSuccess(response, '/robots.txt');
		assert.match(response.headers.get('content-type') ?? '', /^text\/plain\b/i);
		assert.equal(body, `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
		assert.doesNotMatch(body, /^Disallow:\s*\/$/im);
	});

	it('publishes the exact slashless canonical URL inventory in sitemap.xml', async () => {
		const response = await fetchWithoutRedirect(server.baseUrl, '/sitemap.xml');
		const body = await response.text();
		const locs = allMatches(body, /<loc>([^<]+)<\/loc>/g);

		assertDirectSuccess(response, '/sitemap.xml');
		assert.match(response.headers.get('content-type') ?? '', /^application\/xml\b/i);
		assert.match(body, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
		assert.match(body, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
		assert.deepEqual(locs, expectedSitemapUrls);
		assert.equal(new Set(locs).size, 37, 'sitemap URLs should be unique');
		assert.ok(locs.every((url) => url === `${siteUrl}/` || !url.endsWith('/')));
		assert.match(body.trimEnd(), /<\/urlset>$/);

		for (const path of publicHtmlPaths) {
			const pageResponse = await fetchWithoutRedirect(server.baseUrl, path);
			assertDirectSuccess(pageResponse, `sitemap URL ${path}`);
		}
	});

	it('serves a current RFC 9116 security.txt from the well-known location', async () => {
		const response = await fetchWithoutRedirect(server.baseUrl, '/.well-known/security.txt');
		const body = await response.text();
		const fields = body
			.trimEnd()
			.split(/\r?\n/)
			.map((line) => line.split(/:\s+/, 2));
		const contacts = fields.filter(([name]) => name === 'Contact').map(([, value]) => value);
		const expires = fields.filter(([name]) => name === 'Expires').map(([, value]) => value);
		const canonicals = fields.filter(([name]) => name === 'Canonical').map(([, value]) => value);

		assertDirectSuccess(response, '/.well-known/security.txt');
		assert.match(response.headers.get('content-type') ?? '', /^text\/plain\b/i);
		assert.equal(fields[0][0], 'Contact', 'the first field should be a security contact');
		assert.deepEqual(contacts, ['mailto:noc@h2technologiesllc.com', `${siteUrl}/contact`]);
		assert.equal(expires.length, 1, 'security.txt should have exactly one Expires field');
		assert.ok(Number.isFinite(Date.parse(expires[0])), 'Expires should use a valid date');
		assert.ok(Date.parse(expires[0]) > Date.now(), 'security.txt should not be expired');
		assert.ok(
			Date.parse(expires[0]) - Date.now() < 366 * 24 * 60 * 60 * 1000,
			'Expires should be less than one year in the future'
		);
		assert.deepEqual(canonicals, [`${siteUrl}/.well-known/security.txt`]);
		assert.deepEqual(
			fields.filter(([name]) => name === 'Preferred-Languages').map(([, value]) => value),
			['en']
		);
		assert.ok(contacts.every((contact) => /^(?:mailto:|https:\/\/)/.test(contact)));
	});
});

describe('HTML metadata and structured data', () => {
	it('serves all 37 canonical pages with complete, unique metadata', async () => {
		const titles = new Set();
		const descriptions = new Set();

		for (const path of publicHtmlPaths) {
			const { html } = await getHtml(path);
			const canonical = `${siteUrl}${path}`;
			const titleMatches = allMatches(html, /<title>([^<]+)<\/title>/gi);
			const description = metaContent(html, 'name', 'description');
			const robots = metaContent(html, 'name', 'robots');
			const headingCount = (html.match(/<h1\b/gi) ?? []).length;
			const jsonLd = parseJsonLd(html, path);
			const jsonLdDocuments = jsonLd.flatMap((block) => (Array.isArray(block) ? block : [block]));

			assert.equal(titleMatches.length, 1, `${path} should have exactly one title`);
			assert.ok(titleMatches[0].trim().length >= 20, `${path} should have a meaningful title`);
			assert.ok(titleMatches[0].length <= 70, `${path} title should remain concise`);
			assert.ok(
				description && description.length >= 50,
				`${path} should have a useful description`
			);
			assert.ok(description.length <= 160, `${path} description should remain concise`);
			assert.equal(linkHref(html, 'canonical'), canonical, `${path} canonical should be exact`);
			assert.equal(metaContent(html, 'property', 'og:url'), canonical);
			assert.equal(metaContent(html, 'property', 'og:site_name'), 'H2 Technologies LLC');
			assert.equal(metaContent(html, 'name', 'twitter:card'), 'summary_large_image');
			assert.match(metaContent(html, 'property', 'og:image') ?? '', /^https:\/\//);
			assert.ok(metaContent(html, 'property', 'og:image:alt'));
			assert.equal(robots, 'index,follow,max-image-preview:large');
			assert.equal(headingCount, 1, `${path} should have exactly one h1`);
			assert.ok(
				jsonLdDocuments.some(
					(document) => Array.isArray(document['@graph']) && document['@graph'].length >= 2
				),
				`${path} should include a schema.org graph`
			);
			assert.ok(!titles.has(titleMatches[0]), `${path} should not duplicate a page title`);
			assert.ok(!descriptions.has(description), `${path} should not duplicate a description`);
			titles.add(titleMatches[0]);
			descriptions.add(description);
		}
	});

	it('provides browser, icon, and install metadata on the app shell', async () => {
		for (const path of ['/', '/services/custom-software-development']) {
			const { html } = await getHtml(path);
			const pageUrl = `${siteUrl}${path}`;
			const manifest = linkHref(html, 'manifest');
			const icon = linkHref(html, 'icon');
			const appleTouchIcon = linkHref(html, 'apple-touch-icon');

			assert.ok(manifest);
			assert.ok(icon);
			assert.ok(appleTouchIcon);
			assert.equal(new URL(manifest, pageUrl).pathname, '/site.webmanifest');
			assert.equal(new URL(icon, pageUrl).pathname, '/favicon.png');
			assert.equal(new URL(appleTouchIcon, pageUrl).pathname, '/squareLogo.png');
			assert.ok(metaContent(html, 'name', 'theme-color'));
		}
	});

	it('marks unknown pages noindex and returns a real 404', async () => {
		const response = await fetchWithoutRedirect(server.baseUrl, '/this-page-does-not-exist');
		const html = await response.text();

		assert.equal(response.status, 404);
		assert.equal(metaContent(html, 'name', 'robots'), 'noindex,nofollow');
		assert.match(html, /<h1\b[^>]*>Page not found<\/h1>/i);
		assert.equal(linkHref(html, 'canonical'), undefined);
	});
});

describe('security posture and public links', () => {
	it('sets the production security headers without delegating them to a proxy', async () => {
		const { response } = await getHtml('/');
		const csp = response.headers.get('content-security-policy') ?? '';
		const scriptSources = cspDirective(csp, 'script-src');

		assert.match(csp, /(?:^|;)\s*default-src 'self'/);
		assert.match(csp, /(?:^|;)\s*object-src 'none'/);
		assert.match(csp, /(?:^|;)\s*base-uri 'self'/);
		assert.match(csp, /(?:^|;)\s*frame-ancestors 'none'/);
		assert.match(csp, /(?:^|;)\s*upgrade-insecure-requests(?:;|$)/);
		assert.deepEqual(cspDirective(csp, 'style-src'), ["'self'"]);
		assert.deepEqual(cspDirective(csp, 'style-src-attr'), ["'unsafe-inline'"]);
		assert.ok(scriptSources.includes("'self'"));
		assert.ok(scriptSources.some((source) => source.startsWith("'nonce-")));
		assert.ok(!scriptSources.includes("'unsafe-inline'"));
		assert.equal(response.headers.get('strict-transport-security'), 'max-age=31536000');
		assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
		assert.equal(response.headers.get('x-frame-options'), 'DENY');
		assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
		assert.match(response.headers.get('permissions-policy') ?? '', /camera=\(\)/);
		assert.equal(response.headers.get('cross-origin-opener-policy'), 'same-origin');
		assert.equal(response.headers.get('cache-control'), null, 'HTML should not be asset-cached');
	});

	it('secures and caches public assets without blocking the embedded routing PDF', async () => {
		for (const path of [
			'/analytics.js',
			'/site.webmanifest',
			'/wideLogo.png',
			'/bgp-routing-policy.pdf'
		]) {
			const response = await fetchWithoutRedirect(server.baseUrl, path);
			assertDirectSuccess(response, path);
			assert.equal(response.headers.get('strict-transport-security'), 'max-age=31536000');
			assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
			assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
			assert.equal(
				response.headers.get('cache-control'),
				'public, max-age=3600, stale-while-revalidate=86400'
			);
		}

		const { html } = await getHtml('/');
		const immutableReference = html.match(/["']((?:\.\/|\/)_app\/immutable\/[^"')]+)/)?.[1];
		assert.ok(immutableReference, 'the app shell should reference a fingerprinted asset');
		const immutablePath = new URL(immutableReference, `${server.baseUrl}/`).pathname;
		const immutableResponse = await fetchWithoutRedirect(server.baseUrl, immutablePath);
		assertDirectSuccess(immutableResponse, immutablePath);
		assert.match(
			immutableResponse.headers.get('cache-control') ?? '',
			/^public,\s*max-age=31536000,\s*immutable$/
		);
		assert.equal(immutableResponse.headers.get('x-content-type-options'), 'nosniff');
		assert.equal(
			(await fetchWithoutRedirect(server.baseUrl, '/bgp-routing-policy.pdf')).headers.get(
				'x-frame-options'
			),
			null,
			'the same-origin routing PDF must remain embeddable'
		);
	});

	it('has no broken, redirecting, or unsafe internal links', async () => {
		const htmlByPath = new Map();
		const internalTargets = new Set();

		for (const path of publicHtmlPaths) {
			const { html } = await getHtml(path);
			htmlByPath.set(path, html);

			for (const anchorTag of html.match(/<a\b[^>]*>/gi) ?? []) {
				const href = attribute(anchorTag, /^<a\b[^>]*>$/i, 'href');
				if (!href) continue;

				if (/\btarget="_blank"/i.test(anchorTag)) {
					const rel = attribute(anchorTag, /^<a\b[^>]*>$/i, 'rel')?.split(/\s+/) ?? [];
					assert.ok(rel.includes('noopener'), `${path} target=_blank link should use noopener`);
					assert.ok(rel.includes('noreferrer'), `${path} target=_blank link should use noreferrer`);
				}

				const target = new URL(href.replaceAll('&amp;', '&'), `${siteUrl}${path}`);
				if (target.origin !== siteUrl) continue;
				assert.equal(target.protocol, 'https:');
				assert.ok(
					target.pathname === '/' || !target.pathname.endsWith('/'),
					`${path} should link to the slashless path ${target.pathname}`
				);
				internalTargets.add(`${target.pathname}${target.search}`);

				if (target.hash && publicHtmlPaths.includes(target.pathname)) {
					const targetHtml =
						htmlByPath.get(target.pathname) ?? (await getHtml(target.pathname)).html;
					assert.match(
						targetHtml,
						new RegExp(`\\bid="${escapeRegex(decodeURIComponent(target.hash.slice(1)))}"`),
						`${path} fragment ${target.hash} should exist on ${target.pathname}`
					);
				}
			}
		}

		for (const target of internalTargets) {
			const response = await fetchWithoutRedirect(server.baseUrl, target);
			assertDirectSuccess(response, `internal link ${target}`);
		}
	});

	it('uses the hosted contact workflow without putting visitor data in this site URL', async () => {
		const { html } = await getHtml('/contact');
		const anchors = html.match(/<a\b[^>]*>/gi) ?? [];
		const hostedLinks = anchors
			.map((anchorTag) => attribute(anchorTag, /^<a\b[^>]*>$/i, 'href'))
			.filter((href) => href?.includes('client-portal.app.intuit.com'))
			.map((href) => new URL(href.replaceAll('&amp;', '&')));

		assert.doesNotMatch(html, /<form\b/i, 'the local page should not submit visitor data with GET');
		assert.ok(hostedLinks.length >= 1, 'contact should expose the hosted Intuit workflow');
		for (const link of hostedLinks) {
			assert.equal(link.protocol, 'https:');
			assert.equal(link.hostname, 'client-portal.app.intuit.com');
			assert.equal(link.pathname, '/contact-form');
			assert.deepEqual([...link.searchParams.keys()].sort(), ['accountId', 'formId']);
		}
		assert.match(html, />\s*Open the Hosted Contact Form\s*</i);
	});

	it('does not contain production-blocking placeholder markers in tracked source', async () => {
		const sourceFiles = [
			'src/lib/posts.ts',
			'src/routes/+page.svelte',
			'src/routes/contact/+page.svelte',
			'src/routes/resources/[slug]/+page.svelte'
		];

		for (const relativePath of sourceFiles) {
			const source = await readFile(new URL(`../${relativePath}`, import.meta.url), 'utf8');
			assert.doesNotMatch(source, /\b(?:TODO|FIXME)\b/i, relativePath);
			assert.doesNotMatch(source, /lorem ipsum/i, relativePath);
		}
	});
});
