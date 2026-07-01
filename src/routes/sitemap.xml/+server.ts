import { locations } from '$lib/locations';
import { posts } from '$lib/posts';
import { services } from '$lib/services';
import { site } from '$lib/site';

export const prerender = true;

const staticPaths = [
	'/',
	'/about/',
	'/services/',
	'/locations/',
	'/resources/',
	'/contact/',
	'/routing/'
];

export function GET() {
	const paths = [
		...staticPaths,
		...services.map((service) => `/services/${service.slug}/`),
		...locations.map((location) => `/locations/${location.slug}/`),
		...posts.map((post) => `/resources/${post.slug}/`)
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
	.map(
		(path) => `	<url>
		<loc>${site.url}${path}</loc>
		<changefreq>${path === '/' ? 'weekly' : 'monthly'}</changefreq>
		<priority>${path === '/' ? '1.0' : '0.7'}</priority>
	</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8'
		}
	});
}
