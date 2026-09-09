/**
 * Canonical URL policy for h2technologiesllc.com: exactly one URL per page, with no
 * trailing slash (the root `/` excepted) and no repeated slashes.
 *
 * SvelteKit already normalizes trailing slashes for routes it owns, but `adapter-node`
 * mounts its static file handler *before* the SvelteKit handler, so `/favicon.png/` and
 * `/bgp-routing-policy.pdf/` are served as 200s from disk and never reach the router.
 * Running this normalization in `server.js`, ahead of the adapter handler, is what makes
 * the policy apply to every request the origin serves rather than only to page routes.
 *
 * The request target is treated as an opaque string: percent-encoding and the query
 * string are preserved byte for byte so redirects never rewrite a URL's meaning.
 *
 * @param {string | undefined} requestTarget the origin-form request target, e.g. `/about/?a=1`
 * @returns {string | null} the canonical target to redirect to, or `null` if already canonical
 */
export function canonicalTarget(requestTarget) {
	const target = requestTarget && requestTarget.length > 0 ? requestTarget : '/';

	// Only the path is normalized; the query and fragment are carried across untouched.
	const queryIndex = target.indexOf('?');
	const hashIndex = target.indexOf('#');
	const boundaries = [queryIndex, hashIndex].filter((index) => index !== -1);
	const pathEnd = boundaries.length > 0 ? Math.min(...boundaries) : target.length;

	const pathname = target.slice(0, pathEnd);
	const suffix = target.slice(pathEnd);

	// Absolute-form targets (`GET https://host/path`) and authority-form CONNECT targets
	// are left to the adapter; rewriting them here could change the origin.
	if (!pathname.startsWith('/')) {
		return null;
	}

	let normalized = pathname.replaceAll(/\/{2,}/g, '/');
	if (normalized.length > 1) {
		normalized = normalized.replace(/\/+$/, '') || '/';
	}

	if (normalized === pathname) {
		return null;
	}

	// Defense in depth: a `Location` starting with `//` is protocol-relative and would send
	// the visitor to another origin. Collapsing repeated slashes already prevents this, so
	// treat any survivor as a request we refuse to redirect rather than one we rewrite.
	if (!normalized.startsWith('/') || normalized.startsWith('//')) {
		return null;
	}

	return `${normalized}${suffix}`;
}

/**
 * The one hostname this site answers to. It matches `site.url` in `src/lib/site.ts` and
 * `siteUrl` in the test fixture; all three are the same string written in the three places
 * that need it without importing TypeScript into the plain-JS server entry.
 */
export const CANONICAL_HOST = 'h2technologiesllc.com';

/**
 * The origin to redirect to when a request arrives on the `www` spelling of the canonical
 * host, or `null` when the request should be served where it landed.
 *
 * Only the exact `www.` prefix of `CANONICAL_HOST` redirects. Every other host — the
 * canonical host itself, `localhost`, the container's `127.0.0.1` health check, and any
 * preview or staging domain — is deliberately served as-is. A blanket "redirect anything
 * unrecognised" rule would be the more thorough-sounding policy and would break all four.
 *
 * `www` and the apex both resolving means the same page can be reached at two URLs. The
 * `rel="canonical"` on every page already names the apex, which is what search engines
 * consolidate on, so this is a redundancy rather than a fix for a live indexing bug — but
 * a 301 settles it at the origin instead of asking every client to trust a hint.
 *
 * @param {string | undefined} hostHeader the request's `Host` header, e.g. `www.example.com:443`
 * @returns {string | null} the canonical origin, e.g. `https://example.com`, or `null`
 */
export function canonicalOrigin(hostHeader) {
	if (!hostHeader) return null;

	// A `Host` header may carry a port, and hostnames are case-insensitive.
	const hostname = hostHeader.toLowerCase().split(':', 1)[0];

	return hostname === `www.${CANONICAL_HOST}` ? `https://${CANONICAL_HOST}` : null;
}
