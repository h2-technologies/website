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
