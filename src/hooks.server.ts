import type { Handle } from '@sveltejs/kit';
import { SESSION_COOKIE_NAME, verifySession } from '$lib/server/auth';

const securityHeaders = {
	'cross-origin-opener-policy': 'same-origin',
	'permissions-policy': 'camera=(), geolocation=(), microphone=(), payment=(), usb=()',
	'referrer-policy': 'strict-origin-when-cross-origin',
	'strict-transport-security': 'max-age=31536000',
	'x-content-type-options': 'nosniff',
	'x-frame-options': 'DENY',
	'x-permitted-cross-domain-policies': 'none'
};

const LOGIN_PATH = '/admin/login';

/**
 * The whole admin authentication check lives here rather than being split between a page guard
 * and a load function. This application is served by `adapter-node` as one long-lived process,
 * so a real database lookup per `/admin` request is affordable, and keeping it in a single place
 * means a new admin route is protected by existing here rather than by remembering to add a
 * guard. `/admin` is also marked `noindex` at the header level, which covers the JSON and
 * redirect responses that never carry a `<meta>` tag.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const isAdminRoute = event.url.pathname === '/admin' || event.url.pathname.startsWith('/admin/');

	if (isAdminRoute) {
		event.locals.user = await verifySession(event.cookies.get(SESSION_COOKIE_NAME));
	} else {
		event.locals.user = null;
	}

	const response =
		isAdminRoute && event.url.pathname !== LOGIN_PATH && !event.locals.user
			? new Response(null, { status: 303, headers: { location: LOGIN_PATH } })
			: await resolve(event);

	for (const [header, value] of Object.entries(securityHeaders)) {
		response.headers.set(header, value);
	}

	if (isAdminRoute) {
		response.headers.set('x-robots-tag', 'noindex, nofollow');
	}

	return response;
};
