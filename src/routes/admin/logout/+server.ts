import type { RequestHandler } from './$types';
import { SESSION_COOKIE_NAME, revokeSession } from '$lib/server/auth';

/**
 * Logging out deletes the session row, so a copied cookie value stops working immediately
 * rather than remaining valid until it expires.
 */
export const POST: RequestHandler = async ({ cookies }) => {
	await revokeSession(cookies.get(SESSION_COOKIE_NAME));
	cookies.delete(SESSION_COOKIE_NAME, { path: '/' });

	return new Response(null, {
		status: 303,
		headers: { location: '/admin/login' }
	});
};
