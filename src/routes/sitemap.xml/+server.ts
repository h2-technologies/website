import { absoluteUrl } from '$lib/site';

export const prerender = false;

const sitemapPaths = ['/', '/services', '/about'];

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
			'content-type': 'application/xml; charset=utf-8'
		}
	});
}
