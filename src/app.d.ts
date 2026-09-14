// See https://svelte.dev/docs/kit/types#app.d.ts

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	namespace globalThis {
		//eslint-disable-next-line
		var prisma: unknown;
	}

	/**
	 * WebMCP, as far as `src/lib/webmcp.ts` uses it.
	 *
	 * The API is still a draft and no `@types` package tracks it, so the surface this site
	 * touches is declared here rather than reached for through `any`. Everything is
	 * optional: the interface describes what a user agent *may* implement, and the feature
	 * tests in `webmcp.ts` are what decide whether any of it is there.
	 *
	 * `execute` takes an unknown-valued record on purpose. Its argument is assembled by a
	 * model and is not checked against `inputSchema` before it arrives, so the tools read
	 * each field defensively instead of trusting the declaration.
	 */
	type ModelContextToolResult = { content: { type: 'text'; text: string }[] };

	interface ModelContextTool {
		name: string;
		description: string;
		inputSchema?: object;
		annotations?: {
			readOnlyHint?: boolean;
			consequentialHint?: boolean;
			untrustedContentHint?: boolean;
		};
		execute: (input: Record<string, unknown>) => Promise<ModelContextToolResult>;
	}

	interface ModelContext {
		/** Declares the page's whole tool set at once, replacing any previous one. */
		provideContext?: (context: { tools: ModelContextTool[] }) => void | Promise<void>;
		/** Adds one tool, optionally withdrawn again through `options.signal`. */
		registerTool?: (
			tool: ModelContextTool,
			options?: { signal?: AbortSignal }
		) => void | Promise<void>;
	}

	interface Navigator {
		readonly modelContext?: ModelContext;
	}

	/** Earlier drafts hang the same object off `document` rather than `navigator`. */
	interface Document {
		readonly modelContext?: ModelContext;
	}
}

export {};
