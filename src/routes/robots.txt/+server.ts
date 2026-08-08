import { absoluteUrl } from '$lib/site';

export const prerender = false;

export function GET() {
	return new Response(
		`User-agent: *
Allow: /

Sitemap: ${absoluteUrl('/sitemap.xml')}
`,
		{
			headers: {
				'cache-control': 'public, max-age=3600',
				'content-type': 'text/plain; charset=utf-8'
			}
		}
	);
}
