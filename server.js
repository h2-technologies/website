import { createServer } from 'node:http';
import { handler } from './build/handler.js';
import { canonicalOrigin, canonicalTarget } from './canonical-url.js';

const host = process.env.HOST ?? '0.0.0.0';
const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const shutdownTimeout = Number.parseInt(process.env.SHUTDOWN_TIMEOUT ?? '30', 10) * 1000;

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
	throw new Error('PORT must be an integer between 1 and 65535');
}

const staticSecurityHeaders = {
	'referrer-policy': 'strict-origin-when-cross-origin',
	'strict-transport-security': 'max-age=31536000',
	'x-content-type-options': 'nosniff',
	'x-permitted-cross-domain-policies': 'none'
};

const immutableAsset = /^\/_app\/immutable\//;
const cacheableAsset = /\.(?:avif|css|gif|ico|jpe?g|js|json|pdf|png|svg|webmanifest|webp|woff2?)$/i;

/**
 * File types a browser renders as an *active document* when they are navigated to directly,
 * which means script inside them runs in this site's origin.
 *
 * `adapter-node` mounts its static file handler ahead of the SvelteKit handler, so anything
 * served from disk never reaches `src/hooks.server.ts` and never receives the page CSP that
 * SvelteKit attaches to rendered HTML. A `.svg` in `static/` is therefore served with nothing
 * but `nosniff` — and `nosniff` does not help here, because `image/svg+xml` is the correct
 * type and the browser is right to execute it.
 *
 * No such file is in `static/` today; this exists so that adding one later is not silently a
 * stored-XSS primitive. PDFs are deliberately excluded: the routing policy PDF is embedded
 * same-origin on `/routing`, and the browser's built-in viewer is left to load unimpeded.
 */
const activeDocumentAsset = /\.(?:svg|html?|xhtml)$/i;
const activeDocumentCsp = "default-src 'none'; frame-ancestors 'self'; base-uri 'none'";

const server = createServer((request, response) => {
	for (const [header, value] of Object.entries(staticSecurityHeaders)) {
		response.setHeader(header, value);
	}

	// Collapse every non-canonical spelling of a URL onto the canonical one before the
	// adapter handler can answer it, so static assets normalize the same way pages do.
	const requestTarget = request.url ?? '/';
	const pathTarget = canonicalTarget(requestTarget);
	const origin = canonicalOrigin(request.headers.host);

	// The host redirect pastes the request target onto the canonical origin, so it may only
	// run for an origin-form target (`/path`). An absolute-form target (`GET http://host/x`)
	// or the authority-form `*` that `OPTIONS` uses would otherwise be concatenated straight
	// onto the origin and produce a `Location` like `https://example.comhttp://host/x`, whose
	// authority is neither this site nor the one that was asked for. `canonicalTarget`
	// already declines to rewrite those targets for exactly this reason; the host redirect
	// declines for the same one and leaves them to the adapter.
	const canRedirectHost = origin !== null && requestTarget.startsWith('/');

	// Host and path are resolved together so `www.example.com/about/` reaches
	// `https://example.com/about` in one hop. Emitting the host redirect and the trailing
	// slash redirect separately would be two round trips and a redirect chain for a crawler
	// to follow, which is exactly what the canonical policy exists to avoid.
	const redirectTarget = canRedirectHost ? `${origin}${pathTarget ?? requestTarget}` : pathTarget;

	if (redirectTarget !== null) {
		response.writeHead(301, {
			'cache-control': 'public, max-age=3600',
			'content-length': 0,
			location: redirectTarget
		});
		response.end();
		return;
	}

	const pathname = requestTarget.split('?', 1)[0];
	if (activeDocumentAsset.test(pathname)) {
		// SvelteKit sets its own, wider policy on rendered pages, and `adapter-node` replaces
		// rather than appends when it writes a response's headers, so this only ever survives
		// on a response the static handler answered from disk.
		response.setHeader('content-security-policy', activeDocumentCsp);
	}

	if (immutableAsset.test(pathname)) {
		response.setHeader('cache-control', 'public, max-age=31536000, immutable');
	} else if (cacheableAsset.test(pathname)) {
		response.setHeader('cache-control', 'public, max-age=3600, stale-while-revalidate=86400');
	}

	handler(request, response);
});

server.listen(port, host);

let shuttingDown = false;
function shutdown() {
	if (shuttingDown) return;
	shuttingDown = true;

	const forceClose = setTimeout(() => {
		server.closeAllConnections();
		process.exitCode = 1;
	}, shutdownTimeout);
	forceClose.unref();

	server.close(() => {
		clearTimeout(forceClose);
	});
	server.closeIdleConnections();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
