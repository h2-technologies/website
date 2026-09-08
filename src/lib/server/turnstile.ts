import { env } from '$env/dynamic/private';

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Server-side validation of a Cloudflare Turnstile token.
 *
 * A Turnstile token is single use and worthless until it has been redeemed here, so this call is
 * what makes the widget a control rather than decoration. A missing secret key fails closed:
 * a misconfigured deployment rejects submissions instead of silently accepting bot traffic.
 */
export async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean> {
	const secret = env.TURNSTILE_SECRET_KEY;
	if (!token || !secret) return false;

	let response: Response;
	try {
		response = await fetch(SITEVERIFY_URL, {
			method: 'POST',
			headers: { 'content-type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				secret,
				response: token,
				...(remoteIp ? { remoteip: remoteIp } : {})
			})
		});
	} catch {
		return false;
	}

	if (!response.ok) return false;

	const data = (await response.json().catch(() => null)) as { success?: boolean } | null;
	return data?.success === true;
}
