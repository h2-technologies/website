<script lang="ts">
	import { nap, site } from '$lib/site';

	/** `dark` is used on the slate footer and hero sections, `light` on white panels. */
	export let tone: 'dark' | 'light' = 'dark';
	export let showHeading = false;
	export let headingLevel: 'h2' | 'h3' = 'h2';

	const linkClass =
		tone === 'dark'
			? 'font-semibold text-orange-300 hover:text-orange-200'
			: 'font-semibold text-orange-700 hover:text-orange-800';
	const bodyClass = tone === 'dark' ? 'text-slate-300' : 'text-slate-700';
	const labelClass = tone === 'dark' ? 'text-slate-400' : 'text-slate-500';
</script>

<div class={`text-sm leading-7 ${bodyClass}`}>
	{#if showHeading}
		<svelte:element this={headingLevel} class="text-base font-semibold">
			{nap.legalName}
		</svelte:element>
	{/if}

	<address class="not-italic">
		{#if !showHeading}
			<span class="font-semibold">{nap.legalName}</span><br />
		{/if}
		{#if nap.streetAddress}
			{nap.streetAddress}<br />
		{/if}
		{nap.addressLocality}, {nap.addressRegion}{nap.postalCode ? ` ${nap.postalCode}` : ''}<br />
		United States

		{#if nap.telephone}
			<br /><a class={linkClass} href={`tel:${nap.telephone.replace(/[^+\d]/g, '')}`}
				>{nap.telephone}</a
			>
		{/if}
		{#if nap.email}
			<br /><a class={linkClass} href={`mailto:${nap.email}`}>{nap.email}</a>
		{/if}
	</address>

	{#if nap.openingHours.length}
		<p class="mt-3">
			<span class={labelClass}>Hours:</span>
			{#each nap.openingHours as entry, index}
				{index > 0 ? '; ' : ''}{entry.days.join(', ')} {entry.opens}–{entry.closes}
			{/each}
		</p>
	{/if}

	<p class="mt-3">
		<span class={labelClass}>Security contact:</span>
		<a class={linkClass} href={`mailto:${site.securityEmail}`}>{site.securityEmail}</a>
	</p>

	{#if nap.mapUrl}
		<p class="mt-3">
			<a class={linkClass} href={nap.mapUrl} target="_blank" rel="noopener noreferrer">
				View H2 Technologies on the map
			</a>
		</p>
	{/if}
</div>
