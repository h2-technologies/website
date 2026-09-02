import { createServer } from 'node:http';
import { handler } from './build/handler.js';
import { canonicalTarget } from './canonical-url.js';

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

const server = createServer((request, response) => {
	for (const [header, value] of Object.entries(staticSecurityHeaders)) {
		response.setHeader(header, value);
	}

	// Collapse every non-canonical spelling of a URL onto the canonical one before the
	// adapter handler can answer it, so static assets normalize the same way pages do.
	const redirectTarget = canonicalTarget(request.url);
	if (redirectTarget !== null) {
		response.writeHead(301, {
			'cache-control': 'public, max-age=3600',
			'content-length': 0,
			location: redirectTarget
		});
		response.end();
		return;
	}

	const pathname = (request.url ?? '/').split('?', 1)[0];
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
