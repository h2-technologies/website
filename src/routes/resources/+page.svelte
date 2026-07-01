<script lang="ts">
	import CTA from '$lib/components/CTA.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { posts } from '$lib/posts';
</script>

<Seo
	title="Technology Resources for Business Owners | H2 Technologies LLC"
	description="Practical H2 Technologies resources covering firewalls, Google Workspace, Microsoft 365, BGP, IPv6, remote work security, website redesigns, disaster recovery, and managed IT."
	path="/resources/"
/>

<section class="bg-slate-950 px-6 py-20 text-white sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl">
		<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">Resources</p>
		<h1 class="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
			Practical guides for business technology decisions.
		</h1>
		<p class="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
			Use these starter guides to frame decisions around security, collaboration, networking,
			websites, recovery planning, and IT support.
		</p>
	</div>
</section>

<section class="bg-slate-50 px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
		{#each posts as post}
			<article class="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
				<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">Guide</p>
				<h2 class="mt-3 text-2xl font-semibold tracking-tight">{post.title}</h2>
				<p class="mt-3 text-sm leading-7 text-slate-600">{post.summary}</p>
				<a class="mt-5 inline-flex font-semibold text-orange-700" href={`/resources/${post.slug}/`}
					>Read guide →</a
				>
			</article>
		{/each}
	</div>
</section>

<CTA />
