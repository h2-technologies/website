import { defineConfig } from 'prisma/config';

// Prisma 7 no longer reads `url` from the schema, and no longer loads `.env` on its own, so
// migration and introspection commands take their connection string from here. The application
// itself never uses this file: at runtime `src/lib/server/db.ts` builds the connection from the
// process environment, which is how the deployed container is configured.
try {
	process.loadEnvFile();
} catch {
	// No local .env file. `pnpm prisma generate` does not need a connection string, and the
	// commands that do will fail with a clear message below.
}

export default defineConfig({
	schema: 'prisma/schema.prisma',
	migrations: { path: 'prisma/migrations' },
	datasource: { url: process.env.DATABASE_URL ?? '' }
});
