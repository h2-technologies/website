import { createHash, randomBytes } from 'node:crypto';
import argon2 from 'argon2';
import { prisma } from './db';

export const SESSION_COOKIE_NAME = 'h2_admin_session';

/**
 * Sessions are short-lived on purpose. The admin area holds contact submissions, which include
 * names, email addresses, and free-text messages, so an unattended browser should stop being
 * an authenticated one within a working day rather than a working week.
 */
const SESSION_TTL_MS = 1000 * 60 * 60 * 12;

export async function hashPassword(plain: string): Promise<string> {
	return argon2.hash(plain, { type: argon2.argon2id });
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
	try {
		return await argon2.verify(hash, plain);
	} catch {
		return false;
	}
}

/**
 * Session tokens are stored as SHA-256 digests, so the `sessions` table cannot be read to
 * obtain a working cookie. The token is high-entropy random data rather than a password, so a
 * single fast hash is the right construction here; a slow KDF would only add per-request cost.
 */
function hashToken(token: string): string {
	return createHash('sha256').update(token).digest('hex');
}

export async function createSession(
	userId: string,
	meta: { ipAddress?: string; userAgent?: string }
): Promise<{ token: string; expiresAt: Date }> {
	const token = randomBytes(32).toString('hex');
	const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

	await prisma.session.create({
		data: {
			tokenHash: hashToken(token),
			userId,
			expiresAt,
			ipAddress: meta.ipAddress,
			userAgent: meta.userAgent
		}
	});

	return { token, expiresAt };
}

export type AuthenticatedUser = { id: string; email: string };

export async function verifySession(token: string | undefined): Promise<AuthenticatedUser | null> {
	if (!token) return null;

	const session = await prisma.session.findUnique({
		where: { tokenHash: hashToken(token) },
		include: { user: true }
	});

	if (!session) return null;

	if (session.expiresAt < new Date()) {
		// Expired sessions are removed on sight so the table does not accumulate dead rows that
		// would otherwise need a scheduled sweep.
		await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
		return null;
	}

	return { id: session.user.id, email: session.user.email };
}

export async function revokeSession(token: string | undefined): Promise<void> {
	if (!token) return;
	await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
}
