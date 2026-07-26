import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createServer } from 'node:net';
import { fileURLToPath } from 'node:url';
import { after, before, describe, it } from 'node:test';

const root = fileURLToPath(new URL('../', import.meta.url));
const expectedSiteUrl = 'https://h2technologiesllc.com';

let server;
let baseUrl;

async function findOpenPort() {
	return await new Promise((resolve, reject) => {
		const listener = createServer();
		listener.once('error', reject);
		listener.listen(0, '127.0.0.1', () => {
			const address = listener.address();
			listener.close(() => {
				resolve(address.port);
			});
		});
	});
}

async function waitForServer(url) {
	const deadline = Date.now() + 10_000;
	let lastError;

	while (Date.now() < deadline) {
		try {
			const response = await fetch(url);
			if (response.ok) {
				return;
			}
		} catch (error) {
			lastError = error;
		}

		await new Promise((resolve) => setTimeout(resolve, 150));
	}

	throw lastError ?? new Error(`Server did not become ready at ${url}`);
}

async function fetchRoute(path) {
	const response = await fetch(`${baseUrl}${path}`, { redirect: 'manual' });
	const body = await response.text();

	assert.equal(response.status, 200, `${path} should return HTTP 200`);
	assert.doesNotMatch(body, /<html|<script/i, `${path} should not return the app shell`);

	return {
		body,
		contentType: response.headers.get('content-type') ?? ''
	};
}

before(async () => {
	assert.ok(
		existsSync(new URL('../build/index.js', import.meta.url)),
		'Run `pnpm run build` first'
	);

	const port = await findOpenPort();
	baseUrl = `http://127.0.0.1:${port}`;
	server = spawn(process.execPath, ['build/index.js'], {
		cwd: root,
		env: {
			...process.env,
			HOST: '127.0.0.1',
			PORT: String(port),
			NODE_ENV: 'production'
		},
		stdio: ['ignore', 'pipe', 'pipe']
	});

	await waitForServer(baseUrl);
});

after(() => {
	server?.kill();
});

describe('production metadata routes', () => {
	it('serves robots.txt directly with the canonical sitemap', async () => {
		const { body, contentType } = await fetchRoute('/robots.txt');

		assert.match(contentType, /^text\/plain\b/i);
		assert.equal(
			body,
			`User-agent: *
Allow: /

Sitemap: ${expectedSiteUrl}/sitemap.xml
`
		);
	});

	it('serves sitemap.xml directly with the canonical public URLs', async () => {
		const { body, contentType } = await fetchRoute('/sitemap.xml');
		const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

		assert.match(contentType, /^application\/xml\b/i);
		assert.match(body, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
		assert.match(body, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
		assert.deepEqual(locs, [
			`${expectedSiteUrl}/`,
			`${expectedSiteUrl}/services`,
			`${expectedSiteUrl}/about`
		]);
		assert.match(body.trimEnd(), /<\/urlset>$/);
	});

	it('serves RFC 9116 security.txt directly', async () => {
		const { body, contentType } = await fetchRoute('/.well-known/security.txt');
		const expires = body.match(/^Expires: (.+)$/m)?.[1];

		assert.match(contentType, /^text\/plain\b/i);
		assert.equal(
			body,
			`Contact: ${expectedSiteUrl}/contact
Expires: 2027-07-25T23:59:59.000Z
Preferred-Languages: en
Canonical: ${expectedSiteUrl}/.well-known/security.txt
`
		);
		assert.ok(expires, 'security.txt should include Expires');
		assert.ok(Date.parse(expires) > Date.now(), 'security.txt Expires should be in the future');
	});
});
