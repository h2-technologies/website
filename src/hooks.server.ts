import type { Handle } from '@sveltejs/kit';
import { htmlToMarkdown } from '$lib/server/html-to-markdown';
import {
	MARKDOWN_CONTENT_TYPE,
	estimateTokens,
	negotiatesMarkdown,
	varyOn
} from '$lib/server/markdown-negotiation';
import { absoluteUrl } from '$lib/site';

const securityHeaders = {
	'cross-origin-opener-policy': 'same-origin',
	'permissions-policy': 'camera=(), geolocation=(), microphone=(), payment=(), usb=()',
	'referrer-policy': 'strict-origin-when-cross-origin',
	'strict-transport-security': 'max-age=31536000',
	'x-content-type-options': 'nosniff',
	'x-frame-options': 'DENY',
	'x-permitted-cross-domain-policies': 'none'
};

/**
 * Rebuilds an HTML response as its markdown equivalent, keeping the status and the
 * security headers the HTML was served with.
 *
 * `content-length`, `etag`, and `last-modified` describe the HTML body and are dropped
 * rather than left to describe a body that no longer exists, as are the `link` preload
 * hints, which point at the stylesheet and the hydration bundles for a document the
 * client is not receiving. A page that converts to nothing at all — which no current
 * route does, but a future one might — falls back to the HTML it was given rather than
 * answering an agent with an empty file.
 */
async function asMarkdown(response: Response, url: URL): Promise<Response> {
	const html = await response.text();
	const markdown = htmlToMarkdown(html, { baseUrl: url });

	const headers = new Headers(response.headers);
	headers.delete('content-length');
	headers.delete('etag');
	headers.delete('last-modified');
	headers.delete('link');

	if (markdown) {
		headers.set('content-type', MARKDOWN_CONTENT_TYPE);
		headers.set('x-markdown-tokens', String(estimateTokens(markdown)));
		headers.set('x-original-tokens', String(estimateTokens(html)));
	}

	return new Response(markdown || html, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
}

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	for (const [header, value] of Object.entries(securityHeaders)) {
		response.headers.set(header, value);
	}

	// SvelteKit labels rendered pages `text/html` with no charset. Every page also carries
	// `<meta charset="utf-8">`, so browsers decode correctly either way, but the header wins
	// over the meta tag when both are present and it is what a client reading only the
	// response head sees. Declaring it here removes the guess rather than fixing a live bug.
	// `text/plain` and `application/xml` routes already set their own charset and are left
	// alone, as is anything that has since been given one.
	const contentType = response.headers.get('content-type');
	if (contentType === 'text/html') {
		response.headers.set('content-type', 'text/html; charset=utf-8');
	}

	// Every page is available as HTML and as markdown at the same URL, so what a cache
	// holds depends on `Accept` and has to say so. This is set on the HTML too, not only on
	// the markdown, because the failure it prevents is the other direction: a cache that
	// stored the HTML answering an agent's markdown request out of it.
	if (response.headers.get('content-type')?.startsWith('text/html')) {
		varyOn(response.headers, 'Accept');
	}

	// A client that asked for markdown and would rather have it than HTML gets the page's
	// own prose, with the layout markup, the icons, and the hydration payload left behind.
	// Everything else — every browser, every crawler, anything that did not ask — is served
	// the HTML unchanged.
	if (negotiatesMarkdown(event.request, response)) {
		// Relative links are resolved against the canonical URL rather than the requested one,
		// the same rule `<link rel="canonical">` and `sitemap.xml` follow. A markdown file
		// outlives the request that produced it — it gets saved, quoted, and passed on — so a
		// link in it has to point at the address this site publishes, not at whichever host
		// answered.
		return await asMarkdown(response, new URL(absoluteUrl(event.url.pathname)));
	}

	return response;
};
