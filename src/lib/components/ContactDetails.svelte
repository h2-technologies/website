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

	// `nap.openingHours` is shaped for schema.org, which wants every day named. Printing
	// that list verbatim gives "Monday, Tuesday, Wednesday, Thursday, Friday", so runs of
	// three or more days collapse to a range for display only. Both spellings come from
	// the same array, so the visible hours cannot drift from the marked-up ones.
	const formatDays = (days: string[]) =>
		days.length >= 3 ? `${days[0]}–${days[days.length - 1]}` : days.join(' and ');

	/** `08:00` and `22:00` read as `8 AM` and `10 PM`, matching how the hours are published. */
	const formatTime = (time: string) => {
		const [hour, minute] = time.split(':').map(Number);
		const suffix = hour < 12 ? 'AM' : 'PM';
		const hour12 = hour % 12 === 0 ? 12 : hour % 12;
		return minute === 0
			? `${hour12} ${suffix}`
			: `${hour12}:${String(minute).padStart(2, '0')} ${suffix}`;
	};

	// Assembled here rather than in the markup: an `{#each}` puts its own line breaks
	// between the entries, which renders as a stray space before each separator.
	const openingHoursText = nap.openingHours
		.map(
			(entry) => `${formatDays(entry.days)} ${formatTime(entry.opens)}–${formatTime(entry.closes)}`
		)
		.join('; ');
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
			{openingHoursText}
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
