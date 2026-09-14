import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { after, before, describe, it } from 'node:test';
import { publicHtmlPaths, siteUrl, startProductionServer } from './site-fixture.mjs';

// The banner's expiration is read out of the source rather than restated here, so this file
// cannot drift from `src/lib/promo.ts` and cannot become the second place someone has to edit.
// Reading it also lets the suite assert the correct behaviour on both sides of the deadline:
// the offer is expected to be live before it and gone after it, with no code change in between.
const promoSource = await readFile(new URL('../src/lib/promo.ts', import.meta.url), 'utf8');
const expirationLiteral = promoSource.match(/PROMO_EXPIRATION = new Date\('([^']+)'\)/)?.[1];
const dismissCookie = promoSource.match(/PROMO_DISMISS_COOKIE = '([^']+)'/)?.[1];
const dismissValue = promoSource.match(/PROMO_DISMISS_VALUE = '([^']+)'/)?.[1];

const bannerLabel = 'Limited-time offer';
const headline =
	'$12,000 inventory management software — save $3,000 off our standard $15,000 price.';
const subtext =
	'Offer requires signed contract and payment by September 30, 2026, with a go-live date before October 31, 2026.';

let server;

async function getHtml(path, headers = {}) {
	const response = await fetch(`${server.baseUrl}${path}`, { headers, redirect: 'manual' });
	assert.equal(response.status, 200, `${path} should return HTTP 200`);
	return { response, html: await response.text() };
}

function bannerCount(html) {
	return (html.match(new RegExp(`aria-label="${bannerLabel}"`, 'g')) ?? []).length;
}

before(async () => {
	server = await startProductionServer();
});

after(async () => {
	await server?.close();
});

describe('promotional banner expiration', () => {
	it('states its deadline once, with an explicit time zone offset', () => {
		assert.ok(expirationLiteral, 'src/lib/promo.ts should export a PROMO_EXPIRATION date literal');
		assert.ok(dismissCookie, 'src/lib/promo.ts should export a PROMO_DISMISS_COOKIE name');
		assert.ok(dismissValue, 'src/lib/promo.ts should export a PROMO_DISMISS_VALUE');

		// Without an offset the deadline would move with the server's own time zone, which is the
		// one way a correct constant still produces a wrong retirement time in production.
		assert.match(
			expirationLiteral,
			/(?:Z|[+-]\d{2}:\d{2})$/,
			'PROMO_EXPIRATION must pin an offset rather than inherit the host time zone'
		);
		assert.ok(Number.isFinite(Date.parse(expirationLiteral)), 'PROMO_EXPIRATION must parse');

		// 11:59:59 PM on September 30, 2026 in US Eastern Daylight Time.
		assert.equal(Date.parse(expirationLiteral), Date.parse('2026-10-01T03:59:59Z'));

		assert.equal(
			promoSource.match(/new Date\('20\d\d-/g)?.length,
			1,
			'the expiration should be declared exactly once'
		);
	});

	it('decides on the server, so a browser clock cannot revive or extend the offer', async () => {
		const { html } = await getHtml('/');
		const live = Date.now() < Date.parse(expirationLiteral);

		// The banner is present or absent in the delivered HTML itself. If it were gated in the
		// browser, the markup would ship on every response and only be hidden after hydration.
		assert.equal(
			bannerCount(html) > 0,
			live,
			live
				? 'a live offer should be server-rendered into the HTML'
				: 'an expired offer should never reach the browser'
		);
	});

	it('renders the offer consistently across pages while it is live', async (t) => {
		if (Date.now() >= Date.parse(expirationLiteral)) {
			t.skip('the offer has expired; the retirement test below covers this period');
			return;
		}

		for (const path of ['/', '/contact', '/services/custom-software-development']) {
			const { html } = await getHtml(path);

			assert.equal(bannerCount(html), 1, `${path} should render the banner exactly once`);
			assert.ok(html.includes(headline), `${path} should carry the offer headline`);
			assert.ok(html.includes(subtext), `${path} should carry the offer terms`);

			// Primary call to action, then the contact form as a secondary route.
			assert.match(html, /href="mailto:sales@h2technologiesllc\.com[^"]*"/, `${path} email CTA`);
			assert.ok(
				html.includes('Use the contact form'),
				`${path} should offer the contact form as an alternative`
			);
			assert.match(html, /aria-label="Dismiss this offer"/, `${path} should be dismissible`);

			// The banner must not displace the skip link as the first thing a keyboard reaches.
			assert.ok(
				html.indexOf('Skip to content') < html.indexOf(`aria-label="${bannerLabel}"`),
				`${path} should keep the skip link ahead of the banner`
			);
		}
	});

	it('sends the same markup to a dismissed visitor as to a new one', async (t) => {
		if (Date.now() >= Date.parse(expirationLiteral)) {
			t.skip('the offer has expired; nothing is rendered to dismiss');
			return;
		}

		const fresh = await getHtml('/');
		const returning = await getHtml('/', { cookie: `${dismissCookie}=${dismissValue}` });

		// This is the cacheability contract, not a detail of the banner. The edge stores one
		// response per URL and replays it to everyone, so a response shaped by one visitor's
		// cookie is a response other visitors will be handed. Dismissal therefore happens in
		// the browser, and the server sends everybody the same bytes.
		assert.equal(returning.html, fresh.html, 'the dismissal cookie must not change the HTML');
		assert.doesNotMatch(
			returning.response.headers.get('vary') ?? '',
			/\bCookie\b/i,
			'a page must not claim to vary on a header the cache in front of it ignores'
		);
		assert.equal(bannerCount(fresh.html), 1, 'the banner is server-rendered for every visitor');
	});

	it('hides a dismissed banner before paint, from constants that cannot drift apart', async () => {
		const appHtml = await readFile(new URL('../src/app.html', import.meta.url), 'utf8');
		const appCss = await readFile(new URL('../src/app.css', import.meta.url), 'utf8');
		const config = await readFile(new URL('../svelte.config.js', import.meta.url), 'utf8');
		const inline = appHtml.match(/<script>([\s\S]*?)<\/script>/)?.[1];

		assert.ok(inline, 'src/app.html should carry the pre-paint dismissal script');

		// The script runs before the bundler exists, so it cannot import `src/lib/promo.ts` and
		// the cookie name is written out by hand. Asserting it against the exported constants is
		// what stops a rename there from silently stranding this copy.
		assert.ok(
			inline.includes(`${dismissCookie}=${dismissValue}`),
			'the pre-paint script must read the cookie and value promo.ts defines'
		);
		assert.match(inline, /data-promo-dismissed/, 'it should set the attribute the CSS keys on');
		assert.match(
			appCss,
			/\[data-promo-dismissed\]\s+\.promo-banner/,
			'src/app.css should hide the banner for that attribute'
		);

		// SvelteKit hashes the scripts it generates, but not one written into the template, so
		// this one is pinned in the policy by hand. Recomputing it here is the guard against
		// that pin going stale: reformat the script and this fails with the value to paste.
		const hash = `sha256-${createHash('sha256').update(inline).digest('base64')}`;
		assert.ok(
			config.includes(hash),
			`svelte.config.js must admit the pre-paint script — add '${hash}' to script-src`
		);

		const { response, html } = await getHtml('/');
		assert.ok(
			(response.headers.get('content-security-policy') ?? '').includes(hash),
			'the served policy must admit the pre-paint script'
		);

		// "Before paint" is a claim about document order, so assert it there: the script has to
		// reach the parser ahead of the element it hides, or the banner flashes on its way out.
		assert.ok(
			html.indexOf('data-promo-dismissed') < html.indexOf('class="promo-banner'),
			'the pre-paint script must come before the banner element it hides'
		);
	});

	it('leaves no banner and no reserved space anywhere once the offer has expired', async (t) => {
		if (Date.now() < Date.parse(expirationLiteral)) {
			t.skip('the offer is still live');
			return;
		}

		for (const path of publicHtmlPaths) {
			const { html } = await getHtml(path);
			assert.equal(bannerCount(html), 0, `${path} should not render an expired offer`);
			assert.ok(!html.includes(headline), `${path} should not carry expired offer copy`);
			assert.ok(!html.includes(subtext), `${path} should not carry expired offer terms`);
		}
	});

	it('keeps the offer out of the crawlable URL inventory and canonical metadata', async () => {
		// The banner is a site-wide promotion, not a page, so it must not add a canonical URL.
		const response = await fetch(`${server.baseUrl}/sitemap.xml`, { redirect: 'manual' });
		const body = await response.text();

		assert.ok(!body.includes('promo'), 'the promotion should not introduce a sitemap entry');
		assert.equal(
			[...body.matchAll(/<loc>([^<]+)<\/loc>/g)].length,
			publicHtmlPaths.length,
			'the promotion should not change the published URL count'
		);
		assert.ok(body.includes(`${siteUrl}/contact`), 'the banner CTA target should stay crawlable');
	});
});
