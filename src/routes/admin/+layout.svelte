<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();
</script>

<svelte:head>
	<!-- The `X-Robots-Tag` header set in `src/hooks.server.ts` and the `Disallow: /admin/` line in
	     robots.txt say the same thing. Three layers, because each one fails differently: a header
	     also covers non-HTML responses, and robots.txt is read before anything is fetched. -->
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="min-h-screen bg-slate-50 text-slate-900">
	{#if data.user}
		<nav
			aria-label="Admin navigation"
			class="flex flex-wrap items-center gap-4 border-b border-slate-200 bg-white px-6 py-3"
		>
			<a class="font-semibold" href="/admin/submissions">H2 Admin</a>
			<span class="text-sm text-slate-500">{data.user.email}</span>
			<form method="POST" action="/admin/logout" class="ml-auto">
				<button
					type="submit"
					class="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold transition hover:bg-slate-100"
				>
					Log out
				</button>
			</form>
		</nav>
	{/if}
	<main class="mx-auto max-w-7xl px-6 py-8">
		{@render children()}
	</main>
</div>
