import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		csp: {
			/**
			 * Hashes, not nonces. A nonce is generated per response and is only worth anything
			 * while it stays unpredictable — but these pages are cached at the Cloudflare edge and
			 * replayed to everyone, which freezes one visitor's nonce into a public constant and
			 * leaves the policy admitting any script that quotes it. Hashes are derived from the
			 * script's own bytes, so a cached page and its cached policy stay correct together.
			 *
			 * `auto` would pick hashes only for prerendered pages; nothing here is prerendered.
			 */
			mode: 'hash',
			directives: {
				'default-src': ['self'],
				'base-uri': ['self'],
				// `cloudflareinsights.com` is where the Web Analytics beacon reports; it is a
				// different host from the one that serves the beacon, and allowing only the
				// latter loads a script that then cannot say anything. Confirmed against the
				// beacon's own source, which posts to `https://cloudflareinsights.com/cdn-cgi/rum`
				// and falls back to the same path on this origin.
				'connect-src': [
					'self',
					'https://*.analytics.google.com',
					'https://*.google-analytics.com',
					'https://www.googletagmanager.com',
					'https://cloudflareinsights.com'
				],
				'font-src': ['self'],
				'form-action': ['self'],
				'frame-ancestors': ['none'],
				// Microsoft Bookings is embedded on /contact. Without this host the iframe is
				// blocked and renders as an empty box with nothing in the page to explain why,
				// so the visible fallback link on that page is what a blocked visitor gets.
				'frame-src': ['self', 'https://outlook.office.com'],
				'img-src': [
					'self',
					'data:',
					'https://*.google-analytics.com',
					'https://www.googletagmanager.com'
				],
				'manifest-src': ['self'],
				'media-src': ['self'],
				'object-src': ['none'],
				// `static.cloudflareinsights.com` serves the Web Analytics beacon, which Cloudflare
				// injects into every HTML response when the zone has it enabled. It is listed here
				// rather than left blocked because the alternative is a script tag on every page
				// that the browser refuses and the console reports forever.
				//
				// Cloudflare's other injection — the inline bootstrap for JavaScript Detections
				// that sets `window.__CF$cv$params` — is deliberately *not* admitted, and cannot
				// be. Its body carries per-request tokens, so no fixed hash covers it, and
				// Cloudflare supports it only for nonce-based policies: it parses the CSP response
				// header and adds the nonce to what it injects. This policy is hash-based
				// precisely because the pages are cached at the edge, which would freeze one
				// response's nonce into a public constant. Admitting it would take
				// `'unsafe-inline'`, which is the one thing this directive exists to withhold — so
				// JavaScript Detections should be turned off in Cloudflare instead of paid for in
				// bytes on every response. The script it would load lives under
				// `/cdn-cgi/challenge-platform/` and is already covered by `'self'`.
				//
				// The trailing hash is the blocking banner-dismissal script in `src/app.html`.
				// SvelteKit hashes the scripts it generates itself, but not one written into the
				// template, so that one is pinned here. `tests/promo-banner.test.mjs` recomputes it
				// from the file and fails if an edit to either leaves the two disagreeing.
				'script-src': [
					'self',
					'https://www.googletagmanager.com',
					'https://static.cloudflareinsights.com',
					'sha256-piB4tXbs0GTIFPOA92dnybJr6MEDqs622Pv+MewV438='
				],
				'style-src': ['self'],
				'style-src-attr': ['unsafe-inline'],
				'worker-src': ['self'],
				'upgrade-insecure-requests': true
			}
		}
	}
};

export default config;
