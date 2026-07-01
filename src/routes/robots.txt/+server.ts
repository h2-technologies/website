import { site } from '$lib/site';

export const prerender = true;

export function GET() {
	return new Response(
		`User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`,
		{
			headers: {
				'content-type': 'text/plain; charset=utf-8'
			}
		}
	);
}
