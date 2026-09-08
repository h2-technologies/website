import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

/**
 * Prisma client for the `h2_website` database, created on first use rather than at import time.
 *
 * Nothing a public visitor requests touches the database: the session lookup in
 * `src/hooks.server.ts` returns early when no session cookie is present, and the marketing pages
 * read from `src/lib/*.ts`. Deferring construction keeps a connection pool from being opened in
 * a process that will never query, and lets the application boot — and the production test
 * suite run — on a host that has no `DATABASE_URL` at all. A request that genuinely needs the
 * database on such a host fails loudly here instead of timing out against a default host.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

let client: PrismaClient | undefined;

function createClient(): PrismaClient {
	const connectionString = env.DATABASE_URL;

	if (!connectionString) {
		throw new Error(
			'DATABASE_URL is not set. The admin area and the contact form require the h2_website database.'
		);
	}

	return new PrismaClient({
		adapter: new PrismaPg({ connectionString }),
		log: dev ? ['warn', 'error'] : ['error']
	});
}

function getClient(): PrismaClient {
	// In development the module is re-evaluated on every hot update, so the client is cached on
	// `globalThis` to avoid exhausting Postgres connections across reloads.
	if (dev) {
		globalForPrisma.prisma ??= createClient();
		return globalForPrisma.prisma;
	}

	client ??= createClient();
	return client;
}

export const prisma = new Proxy({} as PrismaClient, {
	get(_target, property) {
		const value = Reflect.get(getClient(), property);
		return typeof value === 'function' ? value.bind(getClient()) : value;
	}
});
