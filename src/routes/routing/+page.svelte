<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title="BGP Routing Policy AS17290 | H2 Technologies LLC"
	description="View the H2 Technologies LLC BGP routing policy for AS17290."
	path="/routing"
/>

<section class="bg-slate-950 px-6 py-12 text-white sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl">
		<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">Routing policy</p>
		<h1 class="mt-4 text-4xl font-semibold tracking-tight">BGP Routing Policy AS17290</h1>
		<p class="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
			This public routing policy is provided for network operators and partners who need H2
			Technologies routing information.
		</p>
	</div>
</section>

<section class="bg-white px-6 py-10 sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl">
		<p id="routing-document-help" class="mb-5 leading-7 text-slate-700">
			If the embedded document is not convenient to use,
			<a
				class="font-semibold text-orange-700 hover:text-orange-800"
				href="/bgp-routing-policy.pdf"
				target="_blank"
				rel="noopener noreferrer">open the routing policy PDF directly</a
			>.
		</p>
		<div class="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
			<iframe
				src="/bgp-routing-policy.pdf"
				title="BGP Routing Policy AS17290"
				aria-describedby="routing-document-help"
				class="h-screen w-full border-0"
				loading="lazy"
			></iframe>
		</div>
	</div>
</section>
