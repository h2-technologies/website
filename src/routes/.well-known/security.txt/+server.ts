import { absoluteUrl, site } from '$lib/site';

export const prerender = false;

const expires = '2027-07-25T23:59:59.000Z';

export function GET() {
	return new Response(
		`Contact: mailto:${site.securityEmail}
Contact: ${absoluteUrl('/contact')}
Expires: ${expires}
Preferred-Languages: en
Canonical: ${absoluteUrl('/.well-known/security.txt')}
`,
		{
			headers: {
				'cache-control': 'public, max-age=3600',
				'content-type': 'text/plain; charset=utf-8'
			}
		}
	);
}
