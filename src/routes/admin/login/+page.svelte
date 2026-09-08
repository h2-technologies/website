<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let submitting = $state(false);
</script>

<svelte:head>
	<!-- The admin layout already carries the `noindex` meta tag for every page under /admin. -->
	<title>Admin login</title>
</svelte:head>

<div class="mx-auto mt-10 max-w-sm">
	<h1 class="text-2xl font-semibold tracking-tight">Admin login</h1>

	<form
		method="POST"
		class="mt-6 space-y-4"
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				submitting = false;
				await update();
			};
		}}
	>
		<label class="block">
			<span class="block text-sm font-medium">Email</span>
			<input
				type="email"
				name="email"
				required
				autocomplete="username"
				class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
			/>
		</label>
		<label class="block">
			<span class="block text-sm font-medium">Password</span>
			<input
				type="password"
				name="password"
				required
				autocomplete="current-password"
				class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
			/>
		</label>

		{#if form?.error}
			<p role="alert" class="text-sm text-red-700">{form.error}</p>
		{/if}

		<button
			type="submit"
			disabled={submitting}
			class="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
		>
			{submitting ? 'Signing in…' : 'Sign in'}
		</button>
	</form>
</div>
