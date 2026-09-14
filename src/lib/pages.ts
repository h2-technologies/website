import { locations } from '$lib/locations';
import { posts } from '$lib/posts';
import { services } from '$lib/services';

/**
 * The page routes this site publishes, derived from the data collections that define
 * them.
 *
 * `sitemap.xml` and `openapi.json` both need this list and neither may drift from the
 * routes, so it is stated once here rather than typed out in each. A page added to
 * `services.ts`, `locations.ts`, or `posts.ts` is in both documents the same day; a page
 * removed disappears from both together.
 */

/** Pages with a route of their own rather than one generated from a collection. */
export const staticPagePaths = [
	'/',
	'/about',
	'/services',
	'/locations',
	'/resources',
	'/faq',
	'/contact',
	'/routing'
];

export const serviceSlugs = services.map((service) => service.slug);
export const locationSlugs = locations.map((location) => location.slug);
export const postSlugs = posts.map((post) => post.slug);

/** Every crawlable page, in the slashless canonical form `rel="canonical"` points at. */
export const pagePaths = [
	...staticPagePaths,
	...serviceSlugs.map((slug) => `/services/${slug}`),
	...locationSlugs.map((slug) => `/locations/${slug}`),
	...postSlugs.map((slug) => `/resources/${slug}`)
];
