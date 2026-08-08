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
			mode: 'auto',
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
				'frame-src': ['self'],
				'img-src': [
					'self',
					'data:',
					'https://*.google-analytics.com',
					'https://www.googletagmanager.com'
				],
				'manifest-src': ['self'],
				'media-src': ['self'],
				'object-src': ['none'],
				'script-src': ['self', 'https://www.googletagmanager.com'],
				'style-src': ['self'],
				'style-src-attr': ['unsafe-inline'],
				'worker-src': ['self'],
				'upgrade-insecure-requests': true
			}
		}
	}
};

export default config;
