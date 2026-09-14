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
				'connect-src': [
					'self',
					'https://*.analytics.google.com',
					'https://*.google-analytics.com',
					'https://www.googletagmanager.com'
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
				// The trailing hash is the blocking banner-dismissal script in `src/app.html`.
				// SvelteKit hashes the scripts it generates itself, but not one written into the
				// template, so that one is pinned here. `tests/promo-banner.test.mjs` recomputes it
				// from the file and fails if an edit to either leaves the two disagreeing.
				'script-src': [
					'self',
					'https://www.googletagmanager.com',
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
