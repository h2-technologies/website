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
 * @returns {string | null} the canonical target to redirect to, or `null` when the request is
 *   served where it landed — either because it is already canonical, or because it is a target
 *   this function refuses to rewrite (see the authority guard below)
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

	if (!normalized.startsWith('/')) {
		return null;
	}

	const result = `${normalized}${suffix}`;

	// Defense in depth: a `Location` that names an authority sends the visitor to another
	// origin entirely, and collapsing repeated slashes is not by itself enough to prevent it.
	//
	// The check is made by construction rather than by pattern, because the spellings that
	// reach an authority are not all `//`. Clients resolve a `Location` with the WHATWG URL
	// parser, which treats a backslash as a slash (`/\host` is `//host`) and strips ASCII
	// tab, CR, and LF from the input before parsing at all (`/<tab>/host` is also `//host`).
	// Each of those survives the slash collapse above untouched — a backslash is not a run of
	// repeated slashes, and neither is a tab — so a guard written as a character test has to
	// enumerate the whole set correctly and stay correct as the URL standard moves. Resolving
	// the result the way the client will is the same question asked directly.
	//
	// The resolved URL is only ever inspected. What is returned is the original string, so
	// percent-encoding and the query survive byte for byte rather than being re-serialized.
	const origin = `https://${CANONICAL_HOST}`;
	try {
		if (new URL(result, origin).origin !== origin) {
			return null;
		}
	} catch {
		return null;
	}

	return result;
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
