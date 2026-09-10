import assert from 'node:assert/strict';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import { after, before, describe, it } from 'node:test';
import { startProductionServer } from './site-fixture.mjs';

const responsiveScenarios = [
	{ path: '/', width: 320, height: 800, label: 'home at narrow mobile' },
	{ path: '/contact', width: 390, height: 844, label: 'contact at mobile' },
	{
		path: '/services/custom-software-development',
		width: 390,
		height: 844,
		label: 'service at mobile'
	},
	{
		path: '/resources/choose-firewall-small-business',
		width: 390,
		height: 844,
		label: 'resource at mobile'
	},
	{ path: '/routing', width: 390, height: 844, label: 'routing policy at mobile' },
	{ path: '/locations/it-services-ohio', width: 768, height: 1024, label: 'location at tablet' },
	{
		path: '/locations/it-services-ashland-ohio',
		width: 390,
		height: 844,
		label: 'city location at mobile'
	},
	{ path: '/faq', width: 390, height: 844, label: 'faq at mobile' },
	{ path: '/resources', width: 768, height: 1024, label: 'resources at tablet' },
	{ path: '/', width: 1280, height: 800, label: 'home at desktop' },
	{
		path: '/services/enterprise-network-design',
		width: 1280,
		height: 800,
		label: 'service at desktop'
	}
];

const accessibilityPaths = [
	'/',
	'/contact',
	'/services/custom-software-development',
	'/locations/it-services-ohio',
	'/locations/it-services-ashland-ohio',
	'/faq',
	'/resources/choose-firewall-small-business',
	'/routing',
	'/this-page-does-not-exist'
];

let browser;
let server;

async function loadPage(path, viewport = { width: 1280, height: 800 }) {
	const context = await browser.newContext({ viewport });
	const page = await context.newPage();
	const consoleErrors = [];
	const pageErrors = [];
	const requestedPaths = [];
	await page.route('https://www.googletagmanager.com/**', (route) =>
		route.fulfill({
			status: 200,
			contentType: 'application/javascript',
			body: ''
		})
	);
	// Microsoft Bookings is stubbed for the same reason as the tag manager above. This
	// suite asserts a clean console and no page errors, and Playwright reports those for
	// every frame in the page, so a live third-party embed would make the build depend on
	// Microsoft's script staying quiet and on this machine having outbound network. The
	// stub still exercises the parts this repository owns: the frame's src, its layout,
	// and whether the Content-Security-Policy admits the host at all.
	await page.route('https://outlook.office.com/**', (route) =>
		route.fulfill({
			status: 200,
			contentType: 'text/html; charset=utf-8',
			body: '<!doctype html><html lang="en"><title>Booking stub</title><p>Booking stub</p>'
		})
	);

	page.on('console', (message) => {
		if (message.type() === 'error') consoleErrors.push(message.text());
	});
	page.on('pageerror', (error) => pageErrors.push(error.message));
	page.on('request', (request) => requestedPaths.push(new URL(request.url()).pathname));

	const response = await page.goto(`${server.baseUrl}${path}`, {
		waitUntil: 'domcontentloaded'
	});
	await page.evaluate(() => document.fonts.ready);

	return { context, page, response, consoleErrors, pageErrors, requestedPaths };
}

before(async () => {
	server = await startProductionServer();
	browser = await chromium.launch({ headless: true });
});

after(async () => {
	await browser?.close();
	await server?.close();
});

describe('real-browser production smoke', () => {
	it('keeps representative pages usable without overflow or browser errors', async () => {
		for (const scenario of responsiveScenarios) {
			const { context, page, response, consoleErrors, pageErrors, requestedPaths } = await loadPage(
				scenario.path,
				{
					width: scenario.width,
					height: scenario.height
				}
			);

			try {
				assert.equal(response?.status(), 200, `${scenario.label} should load`);
				const dimensions = await page.evaluate(() => ({
					viewportWidth: window.innerWidth,
					documentWidth: document.documentElement.scrollWidth,
					bodyWidth: document.body.scrollWidth
				}));
				assert.ok(
					Math.max(dimensions.documentWidth, dimensions.bodyWidth) <= dimensions.viewportWidth + 1,
					`${scenario.label} should not overflow horizontally: ${JSON.stringify(dimensions)}`
				);
				assert.deepEqual(pageErrors, [], `${scenario.label} should not throw page errors`);
				assert.deepEqual(consoleErrors, [], `${scenario.label} should not log console errors`);
				if (scenario.path === '/' && scenario.width < 640) {
					assert.ok(
						!requestedPaths.includes('/herobackground.jpg'),
						`${scenario.label} should not download the desktop hero background`
					);
				}
				if (scenario.path === '/' && scenario.width >= 640) {
					assert.ok(
						requestedPaths.includes('/herobackground.jpg'),
						`${scenario.label} should preserve the branded hero background`
					);
				}
				await page.locator('h1').waitFor({ state: 'visible' });
			} finally {
				await context.close();
			}
		}
	});

	it('exposes primary navigation and key calls to action as crawlable links', async () => {
		const { context, page } = await loadPage('/');

		try {
			const nav = page.getByRole('navigation', { name: 'Primary navigation' });
			await assert.doesNotReject(nav.waitFor({ state: 'visible' }));
			const expectedNavigation = {
				Services: '/services',
				'Ohio IT': '/locations/it-services-ohio',
				Resources: '/resources',
				About: '/about',
				'Talk to an Engineer': '/contact'
			};

			for (const [name, href] of Object.entries(expectedNavigation)) {
				await assert.doesNotReject(
					nav.getByRole('link', { name, exact: true }).waitFor({ state: 'visible' })
				);
				assert.equal(await nav.getByRole('link', { name, exact: true }).getAttribute('href'), href);
			}

			await page.getByRole('link', { name: 'Explore Services', exact: true }).first().click();
			await page.waitForURL('**/services');
			assert.equal(new URL(page.url()).pathname, '/services');
			await page.getByRole('heading', { level: 1 }).waitFor({ state: 'visible' });

			await page.goto(`${server.baseUrl}/services/custom-software-development`);
			assert.equal(
				await page
					.getByRole('link', { name: 'Request a Technology Assessment', exact: true })
					.first()
					.getAttribute('href'),
				'/contact'
			);
		} finally {
			await context.close();
		}
	});

	it('makes the skip link the first keyboard stop and moves focus to main content', async () => {
		const { context, page } = await loadPage('/');

		try {
			await page.evaluate(() => {
				if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
			});
			await page.keyboard.press('Tab');
			assert.equal(await page.locator(':focus').getAttribute('href'), '#main-content');
			assert.equal((await page.locator(':focus').textContent())?.trim(), 'Skip to content');
			await page.keyboard.press('Enter');
			await page.waitForFunction(
				() => location.hash === '#main-content' && document.activeElement?.id === 'main-content'
			);
		} finally {
			await context.close();
		}
	});

	it('provides safe contact and routing document fallbacks', async () => {
		const contact = await loadPage('/contact', { width: 390, height: 844 });

		try {
			const hosted = contact.page.getByRole('link', {
				name: 'Open the Hosted Contact Form',
				exact: true
			});
			const hostedUrl = new URL(await hosted.getAttribute('href'));
			assert.equal(hostedUrl.protocol, 'https:');
			assert.equal(hostedUrl.hostname, 'client-portal.app.intuit.com');
			assert.deepEqual([...hostedUrl.searchParams.keys()].sort(), ['accountId', 'formId']);

			const booking = contact.page.locator('iframe[src*="outlook.office.com"]');
			await booking.waitFor({ state: 'visible' });
			const bookingUrl = new URL(await booking.getAttribute('src'));
			assert.equal(bookingUrl.protocol, 'https:');
			assert.equal(bookingUrl.hostname, 'outlook.office.com');
			assert.ok(await booking.getAttribute('title'), 'the booking frame needs an accessible name');

			// The frame is lazy and sits below the fold on a phone, so it has to be scrolled
			// to before it will load at all. Reading content from inside it is what proves
			// the frame-src allowance admits this host: a CSP-blocked frame is an empty box
			// that looks exactly like one that simply has not finished loading.
			await booking.scrollIntoViewIfNeeded();
			await contact.page
				.frameLocator('iframe[src*="outlook.office.com"]')
				.getByText('Booking stub')
				.waitFor({ state: 'visible' });

			const bookingFallback = contact.page.getByRole('link', {
				name: 'Open the booking page directly',
				exact: true
			});
			assert.equal(
				new URL(await bookingFallback.getAttribute('href')).hostname,
				'outlook.office.com'
			);
		} finally {
			await contact.context.close();
		}

		const routing = await loadPage('/routing', { width: 390, height: 844 });
		try {
			const pdfLink = routing.page.getByRole('link', {
				name: /open the routing policy PDF directly/i
			});
			assert.equal(await pdfLink.getAttribute('href'), '/bgp-routing-policy.pdf');
			assert.equal(await pdfLink.getAttribute('target'), '_blank');
			assert.match(await pdfLink.getAttribute('rel'), /\bnoopener\b/);
			assert.match(await pdfLink.getAttribute('rel'), /\bnoreferrer\b/);
		} finally {
			await routing.context.close();
		}
	});

	it('has no serious or critical automated WCAG smoke failures', async () => {
		for (const path of accessibilityPaths) {
			const { context, page, response } = await loadPage(path, { width: 390, height: 844 });

			try {
				assert.equal(response?.status(), path.includes('does-not-exist') ? 404 : 200);
				const results = await new AxeBuilder({ page })
					.withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
					.analyze();
				const blocking = results.violations.filter((violation) =>
					['serious', 'critical'].includes(violation.impact ?? '')
				);
				assert.deepEqual(
					blocking.map((violation) => ({
						id: violation.id,
						impact: violation.impact,
						targets: violation.nodes.map((node) => node.target)
					})),
					[],
					`${path} should have no serious or critical axe violations`
				);
			} finally {
				await context.close();
			}
		}
	});
});
