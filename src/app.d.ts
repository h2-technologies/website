// See https://svelte.dev/docs/kit/types#app.d.ts

// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			/** The signed-in admin, resolved once per request in `src/hooks.server.ts`. */
			user: { id: string; email: string } | null;
		}
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	namespace globalThis {
		//eslint-disable-next-line
		var prisma: unknown;
	}
}

export {};
