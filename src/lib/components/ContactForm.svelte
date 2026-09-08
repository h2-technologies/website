<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { env } from '$env/dynamic/public';

	// Read at runtime rather than through `$env/static/public`, so the production build does not
	// need the key to exist and a missing key degrades visibly instead of failing the build.
	const siteKey = env.PUBLIC_TURNSTILE_SITE_KEY ?? '';

	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let company = $state('');
	let message = $state('');
	/** Honeypot. A human never sees this field, so anything in it came from a bot. */
	let website = $state('');
	let turnstileToken = $state('');
	let submitting = $state(false);
	let result = $state<{ ok: boolean; message: string } | null>(null);

	onMount(() => {
		if (!siteKey) return;

		// The widget calls back by global name, which is what `data-callback` refers to.
		const turnstileWindow = window as unknown as Record<string, unknown>;
		turnstileWindow.onTurnstileSuccess = (token: string) => {
			turnstileToken = token;
		};
		// A token is single use and expires, so an error or a timeout has to clear it rather than
		// leave a stale value that the server would reject with a confusing message.
		turnstileWindow.onTurnstileReset = () => {
			turnstileToken = '';
		};

		const script = document.createElement('script');
		script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
		script.async = true;
		script.defer = true;
		document.head.appendChild(script);

		return () => {
			script.remove();
			delete turnstileWindow.onTurnstileSuccess;
			delete turnstileWindow.onTurnstileReset;
		};
	});

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!turnstileToken) {
			result = { ok: false, message: 'Please complete the verification check and try again.' };
			return;
		}

		submitting = true;
		result = null;

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({
					name,
					email,
					phone,
					company,
					message,
					website,
					sourcePage: page.url.pathname,
					turnstileToken
				})
			});

			if (response.ok) {
				result = { ok: true, message: 'Thanks — your message is in. Expect a reply shortly.' };
				name = '';
				email = '';
				phone = '';
				company = '';
				message = '';
			} else {
				const data = (await response.json().catch(() => ({}))) as { error?: string };
				result = {
					ok: false,
					message: data.error ?? 'Something went wrong. Please try again.'
				};
			}
		} catch {
			result = { ok: false, message: 'The message could not be sent. Please try again.' };
		} finally {
			// Turnstile tokens are redeemed once, so the widget has to be solved again before the
			// next attempt regardless of how this one ended.
			turnstileToken = '';
			(window as unknown as { turnstile?: { reset: () => void } }).turnstile?.reset();
			submitting = false;
		}
	}
</script>

<form onsubmit={handleSubmit} class="space-y-4">
	<div class="grid gap-4 sm:grid-cols-2">
		<label class="block">
			<span class="block text-sm font-semibold">Name</span>
			<input
				bind:value={name}
				name="name"
				required
				autocomplete="name"
				maxlength="200"
				class="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2"
			/>
		</label>
		<label class="block">
			<span class="block text-sm font-semibold">Email</span>
			<input
				type="email"
				bind:value={email}
				name="email"
				required
				autocomplete="email"
				maxlength="320"
				class="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2"
			/>
		</label>
		<label class="block">
			<span class="block text-sm font-semibold"
				>Phone <span class="font-normal text-slate-500">(optional)</span></span
			>
			<input
				type="tel"
				bind:value={phone}
				name="phone"
				autocomplete="tel"
				maxlength="50"
				class="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2"
			/>
		</label>
		<label class="block">
			<span class="block text-sm font-semibold"
				>Company <span class="font-normal text-slate-500">(optional)</span></span
			>
			<input
				bind:value={company}
				name="company"
				autocomplete="organization"
				maxlength="200"
				class="mt-1 block min-h-11 w-full rounded-lg border border-slate-300 px-3 py-2"
			/>
		</label>
	</div>

	<label class="block">
		<span class="block text-sm font-semibold">What are you trying to improve?</span>
		<textarea
			bind:value={message}
			name="message"
			required
			rows="5"
			maxlength="5000"
			class="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2"
		></textarea>
	</label>

	<!-- Honeypot: hidden from every visitor, including screen reader users, and left out of the
	     tab order. A submission that fills it is answered as a success and stored nowhere. -->
	<div hidden aria-hidden="true">
		<label>
			Leave this field empty
			<input bind:value={website} name="website" tabindex="-1" autocomplete="off" />
		</label>
	</div>

	{#if siteKey}
		<div
			class="cf-turnstile"
			data-sitekey={siteKey}
			data-callback="onTurnstileSuccess"
			data-error-callback="onTurnstileReset"
			data-expired-callback="onTurnstileReset"
			data-timeout-callback="onTurnstileReset"
		></div>
	{:else}
		<p class="rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
			This form is temporarily unavailable. Please use the hosted contact form below.
		</p>
	{/if}

	<p aria-live="polite" class="min-h-6 text-sm">
		{#if result}
			<span class={result.ok ? 'font-semibold text-green-800' : 'font-semibold text-red-700'}>
				{result.message}
			</span>
		{/if}
	</p>

	<button
		type="submit"
		disabled={submitting || !siteKey}
		class="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-orange-700 px-6 py-3 font-semibold text-white transition hover:bg-orange-800 disabled:cursor-not-allowed disabled:opacity-60"
	>
		{submitting ? 'Sending…' : 'Send message'}
	</button>
</form>
