import { json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';
import { prisma } from '$lib/server/db';
import { verifyTurnstile } from '$lib/server/turnstile';

const ContactSchema = z.object({
	name: z.string().trim().min(1).max(200),
	email: z.string().trim().min(1).max(320).pipe(z.email()),
	phone: z.string().trim().max(50).optional(),
	company: z.string().trim().max(200).optional(),
	message: z.string().trim().min(1).max(5000),
	sourcePage: z.string().trim().max(300).optional(),
	turnstileToken: z.string().min(1),
	// The honeypot is accepted rather than rejected by the schema so that a filled value reaches
	// the handler and can be answered with the same success shape a real submission gets.
	website: z.string().max(2000).optional()
});

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_PER_IP = 5;

/**
 * Public contact endpoint, protected in three independent layers: a Cloudflare Turnstile token
 * that is redeemed server-side, a hidden honeypot field no human fills in, and a submission rate
 * limit counted in the database. The rate limit is a query rather than an in-process map so it
 * still holds if the site is ever run as more than one container.
 */
export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	// Cloudflare fronts this origin, so the client address seen by the Node process is the proxy.
	const ip = request.headers.get('cf-connecting-ip') ?? getClientAddress();
	const userAgent = request.headers.get('user-agent') ?? undefined;

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid request body.' }, { status: 400 });
	}

	const parsed = ContactSchema.safeParse(body);
	if (!parsed.success) {
		return json({ error: 'Invalid form data.' }, { status: 400 });
	}

	const data = parsed.data;

	// A filled honeypot is answered as if it succeeded. Telling a bot it was detected only
	// teaches whoever wrote it which field to leave alone next time.
	if (data.website) {
		return json({ ok: true });
	}

	if (!(await verifyTurnstile(data.turnstileToken, ip))) {
		return json({ error: 'Verification failed. Please try again.' }, { status: 400 });
	}

	const recentCount = await prisma.contactSubmission.count({
		where: {
			ipAddress: ip,
			createdAt: { gte: new Date(Date.now() - RATE_LIMIT_WINDOW_MS) }
		}
	});
	if (recentCount >= RATE_LIMIT_MAX_PER_IP) {
		return json({ error: 'Too many submissions. Please try again later.' }, { status: 429 });
	}

	await prisma.contactSubmission.create({
		data: {
			name: data.name,
			email: data.email,
			phone: data.phone || undefined,
			company: data.company || undefined,
			message: data.message,
			sourcePage: data.sourcePage,
			ipAddress: ip,
			userAgent
		}
	});

	return json({ ok: true });
};
