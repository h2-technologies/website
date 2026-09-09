import type { Handle } from '@sveltejs/kit';

const securityHeaders = {
	'cross-origin-opener-policy': 'same-origin',
	'permissions-policy': 'camera=(), geolocation=(), microphone=(), payment=(), usb=()',
	'referrer-policy': 'strict-origin-when-cross-origin',
	'strict-transport-security': 'max-age=31536000',
	'x-content-type-options': 'nosniff',
	'x-frame-options': 'DENY',
	'x-permitted-cross-domain-policies': 'none'
};

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	for (const [header, value] of Object.entries(securityHeaders)) {
		response.headers.set(header, value);
	}

	// SvelteKit labels rendered pages `text/html` with no charset. Every page also carries
	// `<meta charset="utf-8">`, so browsers decode correctly either way, but the header wins
	// over the meta tag when both are present and it is what a client reading only the
	// response head sees. Declaring it here removes the guess rather than fixing a live bug.
	// `text/plain` and `application/xml` routes already set their own charset and are left
	// alone, as is anything that has since been given one.
	const contentType = response.headers.get('content-type');
	if (contentType === 'text/html') {
		response.headers.set('content-type', 'text/html; charset=utf-8');
	}

	return response;
};
