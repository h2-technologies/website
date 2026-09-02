import { locations } from '$lib/locations';
import { posts } from '$lib/posts';
import { services } from '$lib/services';
import { absoluteUrl, contentRevisedAt } from '$lib/site';

export const prerender = false;

const staticPaths = [
	'/',
	'/about',
	'/services',
	'/locations',
	'/resources',
	'/faq',
	'/contact',
	'/routing'
];

// Every entry is derived from the same data that defines the routes themselves, so the sitemap
// cannot list a URL that 404s. Paths are the slashless canonical form that `rel="canonical"`
// and the `server.js` redirect both point at.
const sitemapEntries: { path: string; lastmod: string }[] = [
	...staticPaths.map((path) => ({ path, lastmod: contentRevisedAt })),
	...services.map((service) => ({
		path: `/services/${service.slug}`,
		lastmod: contentRevisedAt
	})),
	...locations.map((location) => ({
		path: `/locations/${location.slug}`,
		lastmod: contentRevisedAt
	})),
	...posts.map((post) => ({ path: `/resources/${post.slug}`, lastmod: post.updatedAt }))
];

export function GET() {
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
	.map(
		({ path, lastmod }) => `	<url>
		<loc>${absoluteUrl(path)}</loc>
		<lastmod>${lastmod}</lastmod>
	</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(body, {
		headers: {
			'cache-control': 'public, max-age=3600',
			'content-type': 'application/xml; charset=utf-8'
		}
	});
}
