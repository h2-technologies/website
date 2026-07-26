import { absoluteUrl } from '$lib/site';

export const prerender = false;

const expires = '2027-07-25T23:59:59.000Z';

export function GET() {
	return new Response(
		`Contact: ${absoluteUrl('/contact')}
Expires: ${expires}
Preferred-Languages: en
Canonical: ${absoluteUrl('/.well-known/security.txt')}
`,
		{
			headers: {
				'content-type': 'text/plain; charset=utf-8'
			}
		}
	);
}
