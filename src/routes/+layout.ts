// The site publishes one URL per page, without a trailing slash, and sitemap.xml plus every
// `rel="canonical"` tag are built from that same slashless form. SvelteKit's default already
// behaves this way, but stating it here makes the policy explicit and keeps a future upgrade
// or a stray per-route override from silently reintroducing `/about/`-style duplicates.
//
// This covers routes SvelteKit handles. `canonical-url.js`, applied in `server.js` ahead of
// the adapter, extends the same policy to static assets that never reach the router.
export const trailingSlash = 'never';
