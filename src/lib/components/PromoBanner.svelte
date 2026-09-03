<script lang="ts">
	import {
		PROMO_DISMISS_COOKIE,
		PROMO_DISMISS_VALUE,
		PROMO_EXPIRATION,
		isPromoActive,
		promo
	} from '$lib/promo';

	/**
	 * Whether the offer is live and undismissed, decided on the server in
	 * `src/routes/+layout.server.ts`. This component never makes that call itself, so the
	 * banner cannot be revived by editing a browser clock.
	 */
	let { show = false }: { show?: boolean } = $props();

	let dismissed = $state(false);
	let expiredWhileOpen = $state(false);

	// Defence in depth for a page held open across the deadline, or served from an edge cache
	// populated before it. This can only ever hide the banner, never show one the server
	// withheld, so it does not reopen the client-clock bypass the server check closes.
	$effect(() => {
		if (!isPromoActive()) {
			expiredWhileOpen = true;
			return;
		}

		const timer = setTimeout(
			() => (expiredWhileOpen = true),
			// setTimeout saturates past ~24.9 days; a longer wait simply stays pending, and the
			// next server-rendered page load applies the expiration anyway.
			Math.min(PROMO_EXPIRATION.getTime() - Date.now(), 2_147_483_647)
		);
		return () => clearTimeout(timer);
	});

	function dismiss() {
		dismissed = true;

		// Outlast the visit but never the offer, so the cookie cannot linger after the promotion.
		const secondsLeft = Math.max(0, Math.floor((PROMO_EXPIRATION.getTime() - Date.now()) / 1000));
		const secure = location.protocol === 'https:' ? '; secure' : '';
		document.cookie = `${PROMO_DISMISS_COOKIE}=${PROMO_DISMISS_VALUE}; path=/; max-age=${secondsLeft}; samesite=lax${secure}`;
	}
</script>

{#if show && !dismissed && !expiredWhileOpen}
	<aside
		aria-label={promo.eyebrow}
		class="relative border-b border-orange-800/60 bg-slate-950 px-6 py-4 text-white sm:px-8 lg:px-12"
	>
		<div
			class="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8"
		>
			<div class="min-w-0 pr-12 sm:pr-14 lg:pr-0">
				<p class="text-xs font-semibold uppercase tracking-[0.22em] text-orange-300">
					{promo.eyebrow}
				</p>
				<p class="mt-2 text-base font-semibold leading-7 sm:text-lg">
					{promo.headline}
				</p>
				<p class="mt-1 text-sm leading-6 text-slate-300">
					{promo.subtext}
				</p>
			</div>

			<div class="flex flex-wrap items-center gap-3 lg:shrink-0">
				<a
					href={promo.emailHref}
					class="inline-flex min-h-11 items-center justify-center rounded-lg bg-orange-700 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-800"
				>
					{promo.emailLabel}
				</a>
				{#if promo.phoneHref}
					<a
						href={promo.phoneHref}
						class="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
					>
						{promo.phoneLabel}
					</a>
				{/if}
				<a
					href={promo.contactHref}
					class="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/20 bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
				>
					{promo.contactLabel}
				</a>
			</div>

			<button
				type="button"
				onclick={dismiss}
				aria-label="Dismiss this offer"
				class="absolute right-2 top-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-300 transition hover:bg-white/10 hover:text-white sm:right-4 lg:static lg:shrink-0"
			>
				<svg
					aria-hidden="true"
					focusable="false"
					viewBox="0 0 20 20"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					class="h-5 w-5"
				>
					<path d="M5 5l10 10M15 5L5 15" />
				</svg>
			</button>
		</div>
	</aside>
{/if}
