import { locations } from '$lib/locations';
import { posts } from '$lib/posts';
import { services } from '$lib/services';
import { absoluteUrl } from '$lib/site';

export const prerender = false;

const staticPaths = [
	'/',
	'/about',
	'/services',
	'/locations',
	'/resources',
	'/contact',
	'/routing'
];

const sitemapPaths = [
	...staticPaths,
	...services.map((service) => `/services/${service.slug}`),
	...locations.map((location) => `/locations/${location.slug}`),
	...posts.map((post) => `/resources/${post.slug}`)
];

export function GET() {
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPaths
	.map(
		(path) => `	<url>
		<loc>${absoluteUrl(path)}</loc>
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
