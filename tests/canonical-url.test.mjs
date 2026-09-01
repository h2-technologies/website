import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { canonicalTarget } from '../canonical-url.js';

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
