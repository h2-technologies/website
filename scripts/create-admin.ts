/**
 * Creates or re-keys an administrator for the /admin area.
 *
 * There is no self-service registration, so this script is the only way an account comes into
 * existence. Run it on a host that has `DATABASE_URL` set for the `h2_website` database:
 *
 *   pnpm tsx scripts/create-admin.ts admin@h2technologiesllc.com "<a real password>"
 *
 * Running it again for an address that already exists replaces that account's password, which
 * is also how a forgotten password is reset.
 */
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const MINIMUM_PASSWORD_LENGTH = 12;

async function main() {
	const [, , emailArgument, password] = process.argv;

	if (!emailArgument || !password) {
		console.error('Usage: pnpm tsx scripts/create-admin.ts <email> "<password>"');
		process.exit(1);
	}
	if (password.length < MINIMUM_PASSWORD_LENGTH) {
		console.error(`Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters.`);
		process.exit(1);
	}

	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		console.error('DATABASE_URL is not set.');
		process.exit(1);
	}

	// Sign-in lowercases the submitted address before looking it up, so the stored address has to
	// be lowercased here too or the account would be unreachable.
	const email = emailArgument.trim().toLowerCase();
	const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
	const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

	try {
		const user = await prisma.adminUser.upsert({
			where: { email },
			create: { email, passwordHash },
			update: { passwordHash }
		});

		// Re-keying an account is also a revocation: every session it already had stops working.
		const { count } = await prisma.session.deleteMany({ where: { userId: user.id } });

		console.log(`Admin user ready: ${user.email}`);
		if (count > 0) {
			console.log(`Revoked ${count} existing session${count === 1 ? '' : 's'}.`);
		}
	} finally {
		await prisma.$disconnect();
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
