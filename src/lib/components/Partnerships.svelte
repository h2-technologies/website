<script lang="ts">
	import { partnerships } from '$lib/site';

	/** `light` sits on white panels, `dark` on the slate sections. */
	export let tone: 'light' | 'dark' = 'light';
	export let headingLevel: 'h2' | 'h3' = 'h2';

	const headingClass = tone === 'dark' ? 'text-white' : 'text-slate-950';
	const bodyClass = tone === 'dark' ? 'text-slate-300' : 'text-slate-600';
	const cardClass =
		tone === 'dark'
			? 'rounded-2xl border border-white/10 bg-white/5 p-6'
			: 'rounded-2xl border border-slate-200 bg-white p-6 shadow-sm';
</script>

<div>
	<svelte:element this={headingLevel} class={`text-xl font-semibold ${headingClass}`}>
		Vendor partnerships
	</svelte:element>
	<p class={`mt-3 leading-7 ${bodyClass}`}>
		Partner status is held with the vendors whose products H2 Technologies actually configures, at
		the tier currently in force.
	</p>

	<ul class="mt-6 grid gap-4 sm:grid-cols-3">
		{#each partnerships as partner}
			<li class={cardClass}>
				{#if partner.logo}
					<!-- The badge carries the vendor, tier, and track as artwork, so it is given a
					     descriptive alt and the text below it is not a second copy of the same claim. -->
					<img
						src={partner.logo}
						alt={partner.logoAlt}
						width="720"
						height="303"
						loading="lazy"
						decoding="async"
						class="h-auto w-56 max-w-full rounded bg-white"
					/>
				{:else}
					<p class={`text-lg font-semibold ${headingClass}`}>{partner.vendor}</p>
				{/if}
				<p class={`mt-3 text-sm font-semibold ${headingClass}`}>
					{partner.credential}{partner.track ? ` · ${partner.track}` : ''}
				</p>
				<p class={`mt-2 text-sm leading-7 ${bodyClass}`}>{partner.summary}</p>
			</li>
		{/each}
	</ul>
</div>
