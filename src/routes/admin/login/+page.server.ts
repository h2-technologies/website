import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { SESSION_COOKIE_NAME, createSession, verifyPassword } from '$lib/server/auth';
import { prisma } from '$lib/server/db';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		redirect(303, '/admin/submissions');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies, getClientAddress }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '')
			.trim()
			.toLowerCase();
		const password = String(form.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required.' });
		}

		const user = await prisma.adminUser.findUnique({ where: { email } });

		// One message for both an unknown address and a wrong password, so the response cannot be
		// used to enumerate which admin accounts exist.
		if (!user || !(await verifyPassword(user.passwordHash, password))) {
			return fail(401, { error: 'Invalid email or password.' });
		}

		const { token, expiresAt } = await createSession(user.id, {
			ipAddress: request.headers.get('cf-connecting-ip') ?? getClientAddress(),
			userAgent: request.headers.get('user-agent') ?? undefined
		});
		await prisma.adminUser.update({
			where: { id: user.id },
			data: { lastLoginAt: new Date() }
		});

		cookies.set(SESSION_COOKIE_NAME, token, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			expires: expiresAt
		});

		redirect(303, '/admin/submissions');
	}
};
