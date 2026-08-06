<script lang="ts">
	import CTA from '$lib/components/CTA.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { locations } from '$lib/locations';
</script>

<Seo
	title="Ohio Technology Consulting Locations | H2 Technologies LLC"
	description="Explore H2 Technologies' Ohio IT, network, cybersecurity, software, website, Google Workspace, and Fortinet consulting services."
	path="/locations"
/>

<section class="bg-slate-950 px-6 py-20 text-white sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl">
		<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">
			Ohio technology partner
		</p>
		<h1 class="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
			Ohio-based consulting for local, remote, and hybrid business teams.
		</h1>
		<p class="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
			H2 Technologies supports Ohio organizations and remote-capable engagements across software,
			networks, security, cloud infrastructure, and day-to-day IT needs.
		</p>
	</div>
</section>

<section class="bg-slate-50 px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-3">
		{#each locations as location}
			<article class="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
				<h2 class="text-2xl font-semibold tracking-tight">{location.title}</h2>
				<p class="mt-3 leading-7 text-slate-600">{location.meta}</p>
				<a
					class="mt-5 inline-flex font-semibold text-orange-700"
					href={`/locations/${location.slug}`}>Learn more →</a
				>
			</article>
		{/each}
	</div>
</section>

<CTA />
