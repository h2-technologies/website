<script lang="ts">
	import { page } from '$app/state';

	const isNotFound = $derived(page.status === 404);
	const heading = $derived(isNotFound ? 'Page not found' : 'Something went wrong');
</script>

<svelte:head>
	<title>{heading} | H2 Technologies LLC</title>
	<meta name="robots" content="noindex,nofollow" />
</svelte:head>

<section class="bg-slate-950 px-6 py-24 text-white sm:px-8 lg:px-12">
	<div
		class="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl sm:p-12"
	>
		<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">
			Error {page.status}
		</p>
		<h1 class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">{heading}</h1>
		<p class="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
			{#if isNotFound}
				The page may have moved or the address may be incorrect. Use the links below to continue.
			{:else}
				The request could not be completed. Please try again, or contact H2 Technologies if the
				problem continues.
			{/if}
		</p>
		<div class="mt-8 flex flex-col gap-3 sm:flex-row">
			<a
				href="/"
				class="inline-flex min-h-12 items-center justify-center rounded-lg bg-orange-700 px-6 py-3 font-semibold text-white transition hover:bg-orange-800"
			>
				Return Home
			</a>
			<a
				href="/contact"
				class="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
			>
				Contact H2 Technologies
			</a>
		</div>
	</div>
</section>
