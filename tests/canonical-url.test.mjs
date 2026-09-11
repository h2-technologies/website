import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CANONICAL_HOST, canonicalOrigin, canonicalTarget } from '../canonical-url.js';

describe('canonical URL normalization', () => {
	it('leaves canonical targets untouched', () => {
		for (const target of [
			'/',
			'/about',
			'/services/bgp-consulting',
			'/locations/it-services-ohio',
			'/resources/what-is-bgp',
			'/sitemap.xml',
			'/robots.txt',
			'/.well-known/security.txt',
			'/favicon.png',
			'/bgp-routing-policy.pdf',
			'/_app/immutable/entry/app.abc123.js',
			'/about?utm_source=google'
		]) {
			assert.equal(canonicalTarget(target), null, `${target} is already canonical`);
		}
	});

	it('strips a trailing slash from every path except the root', () => {
		assert.equal(canonicalTarget('/about/'), '/about');
		assert.equal(canonicalTarget('/services/'), '/services');
		assert.equal(canonicalTarget('/services/bgp-consulting/'), '/services/bgp-consulting');
		assert.equal(canonicalTarget('/locations/it-services-ohio/'), '/locations/it-services-ohio');
		assert.equal(canonicalTarget('/resources/what-is-bgp/'), '/resources/what-is-bgp');
		assert.equal(canonicalTarget('/favicon.png/'), '/favicon.png');
		assert.equal(canonicalTarget('/bgp-routing-policy.pdf/'), '/bgp-routing-policy.pdf');
	});

	it('collapses repeated slashes anywhere in the path', () => {
		assert.equal(canonicalTarget('//'), '/');
		assert.equal(canonicalTarget('///'), '/');
		assert.equal(canonicalTarget('//about'), '/about');
		assert.equal(canonicalTarget('/about//'), '/about');
		assert.equal(canonicalTarget('/about///'), '/about');
		assert.equal(canonicalTarget('/services//bgp-consulting'), '/services/bgp-consulting');
		assert.equal(canonicalTarget('/services//bgp-consulting//'), '/services/bgp-consulting');
	});

	it('preserves the query string verbatim while normalizing the path', () => {
		assert.equal(canonicalTarget('/about/?utm_source=google'), '/about?utm_source=google');
		assert.equal(canonicalTarget('/about/?a=1&b=2'), '/about?a=1&b=2');
		assert.equal(canonicalTarget('/about/?redirect=/a//b/'), '/about?redirect=/a//b/');
		assert.equal(canonicalTarget('/about/?'), '/about?');
		assert.equal(canonicalTarget('/about/#section'), '/about#section');
	});

	it('preserves percent-encoding rather than re-encoding the path', () => {
		assert.equal(canonicalTarget('/resources/a%20b/'), '/resources/a%20b');
		assert.equal(canonicalTarget('/resources/caf%C3%A9/'), '/resources/caf%C3%A9');
		assert.equal(canonicalTarget('/resources/a%2Fb/'), '/resources/a%2Fb');
	});

	it('never emits a protocol-relative location that would leave the origin', () => {
		for (const target of [
			'//evil.example.com/',
			'//evil.example.com/path/',
			'////evil.example.com/'
		]) {
			const result = canonicalTarget(target);
			assert.ok(result !== null, `${target} should normalize`);
			assert.ok(result.startsWith('/'), `${target} should stay rooted`);
			assert.ok(!result.startsWith('//'), `${target} must not become protocol-relative`);
			assert.equal(
				new URL(result, 'https://h2technologiesllc.com').origin,
				'https://h2technologiesllc.com'
			);
		}
	});

	it('refuses every spelling of an authority a URL parser would accept', () => {
		// Clients resolve a `Location` with the WHATWG URL parser, which reads a backslash as
		// a slash and strips ASCII tab, CR, and LF before parsing. So `/\host` and `/<tab>/host`
		// both resolve to `https://host/` exactly as `//host` does, and neither is a run of
		// repeated slashes for the collapse above to catch.
		for (const target of [
			'/\\evil.example.com/',
			'/\\evil.example.com//',
			'/\\\\evil.example.com/',
			'/\\/evil.example.com/',
			'//\\evil.example.com/',
			'/\\@evil.example.com/',
			'/\\evil.example.com/wire-money/',
			'/\t//evil.example.com/',
			'/\t/evil.example.com//',
			'/\n//evil.example.com/',
			'/\r//evil.example.com/'
		]) {
			assert.equal(
				canonicalTarget(target),
				null,
				`${JSON.stringify(target)} must not be rewritten`
			);
		}
	});

	it('leaves a backslash outside the authority position alone', () => {
		// The guard refuses a target whose *authority* a URL parser would read as another
		// host. A backslash deeper in the path names no host, so it is carried through as
		// written rather than rewritten or rejected.
		assert.equal(canonicalTarget('/about/a\\b/'), '/about/a\\b');
		assert.equal(
			canonicalTarget('/resources/%5Cevil.example.com/'),
			'/resources/%5Cevil.example.com'
		);
	});

	it('never emits a location that resolves off-origin, whatever the spelling', () => {
		// The invariant the two tests above are specific cases of: whatever this function
		// returns is resolved against the site origin by the client, and must land back on it.
		const origin = `https://${CANONICAL_HOST}`;

		for (const target of [
			'//evil.example.com/',
			'////evil.example.com/',
			'/\\evil.example.com/',
			'/\\\\evil.example.com/',
			'/\\/evil.example.com/',
			'//\\evil.example.com/',
			'/\\evil.example.com//',
			'/%5C%5Cevil.example.com/',
			'/%2F%2Fevil.example.com/',
			'/\t//evil.example.com/',
			// Normalizes to a same-origin path rather than being refused: the separator the
			// parser would use is the one the collapse already removed, so what is left is an
			// oddly spelled path on this host, not an authority.
			'//\tevil.example.com//',
			'/./\\/evil.example.com/',
			'/..//evil.example.com/',
			'//evil.example.com@' + CANONICAL_HOST + '/',
			'/\\evil.example.com/?next=https://evil.example.com',
			'/\\evil.example.com/#@evil.example.com'
		]) {
			const result = canonicalTarget(target);
			if (result === null) continue;

			assert.ok(result.startsWith('/'), `${target} -> ${result} should stay rooted`);
			assert.equal(
				new URL(result, origin).origin,
				origin,
				`${target} -> ${result} must resolve back to the site origin`
			);
		}
	});

	it('declines to rewrite targets it does not own', () => {
		assert.equal(canonicalTarget('https://h2technologiesllc.com/about/'), null);
		assert.equal(canonicalTarget('h2technologiesllc.com:443'), null);
		assert.equal(canonicalTarget('*'), null);
	});

	it('treats a missing or empty request target as the canonical root', () => {
		assert.equal(canonicalTarget(undefined), null);
		assert.equal(canonicalTarget(''), null);
	});

	it('is idempotent: a normalized target never normalizes again', () => {
		for (const target of [
			'/about/',
			'//about//',
			'/services//bgp-consulting/',
			'/favicon.png/',
			'/about/?a=1'
		]) {
			const once = canonicalTarget(target);
			assert.ok(once !== null);
			assert.equal(canonicalTarget(once), null, `${once} should be a fixed point`);
		}
	});
});

describe('canonical host normalization', () => {
	it('redirects the www spelling of the canonical host to the apex', () => {
		for (const header of [
			`www.${CANONICAL_HOST}`,
			`WWW.${CANONICAL_HOST.toUpperCase()}`,
			`www.${CANONICAL_HOST}:443`
		]) {
			assert.equal(canonicalOrigin(header), `https://${CANONICAL_HOST}`, header);
		}
	});

	it('serves every other host where it landed', () => {
		// The apex is already canonical, and the rest are the container health check, local
		// development, and anything deployed to a preview hostname. Redirecting these would
		// break them, so the rule stays deliberately narrow.
		for (const header of [
			CANONICAL_HOST,
			`${CANONICAL_HOST}:3000`,
			'127.0.0.1:3002',
			'localhost:5173',
			'preview.example.com',
			`www.${CANONICAL_HOST}.evil.example`,
			'',
			undefined
		]) {
			assert.equal(canonicalOrigin(header), null, String(header));
		}
	});
});
