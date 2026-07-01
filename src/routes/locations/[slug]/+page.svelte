<script lang="ts">
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import CTA from '$lib/components/CTA.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import { type LocationPage } from '$lib/locations';
	import { services } from '$lib/services';
	import { absoluteUrl, site } from '$lib/site';

	let { data } = $props<{ data: { location: LocationPage } }>();

	const location = $derived(data.location);
	const path = $derived(`/locations/${location.slug}/`);
	const relatedServices = $derived(
		location.serviceSlugs.map((slug: string) => services.find((service) => service.slug === slug)!)
	);
	const schema = $derived({
		'@type': 'LocalBusiness',
		'@id': `${absoluteUrl(path)}#localbusiness`,
		name: `${site.name} - ${location.title}`,
		url: absoluteUrl(path),
		areaServed: 'Ohio',
		address: { '@type': 'PostalAddress', addressRegion: 'OH', addressCountry: 'US' }
	});
</script>

<Seo title={location.seoTitle} description={location.meta} {path} schema={[schema]} />

<section class="bg-slate-950 px-6 py-20 text-white sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl">
		<Breadcrumbs
			items={[
				{ name: 'Home', href: '/' },
				{ name: 'Locations', href: '/locations/' },
				{ name: location.title, href: path }
			]}
		/>
		<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">Ohio consulting</p>
		<h1 class="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
			{location.h1}
		</h1>
		<p class="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{location.meta}</p>
		<div class="mt-8">
			<a
				href="/contact/"
				class="inline-flex min-h-12 items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-950/30 transition hover:-translate-y-0.5 hover:bg-orange-400"
			>
				Schedule a Free Consultation
			</a>
		</div>
	</div>
</section>

<section class="bg-white px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
		<div>
			<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">
				Local and remote-capable
			</p>
			<h2 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
				Useful support for Ohio organizations without forcing every engagement onsite.
			</h2>
			<p class="mt-4 text-lg leading-8 text-slate-600">
				H2 Technologies works with Ohio businesses that need practical planning, implementation
				help, and a technology partner who can connect technical decisions to business outcomes.
			</p>
		</div>
		<div class="grid gap-4 sm:grid-cols-2">
			<div class="rounded-2xl border border-slate-200 bg-slate-50 p-6">
				<h2 class="text-xl font-semibold">Common needs</h2>
				<ul class="mt-4 space-y-3 text-slate-700">
					<li>Network refreshes, firewall review, and secure remote access</li>
					<li>Website redesigns, custom software, and automation</li>
					<li>Google Workspace, Microsoft 365, and user support</li>
					<li>Disaster recovery, monitoring, and infrastructure documentation</li>
				</ul>
			</div>
			<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
				<h2 class="text-xl font-semibold">How engagements work</h2>
				<ul class="mt-4 space-y-3 text-slate-700">
					<li>Start with a discovery call and current-state review</li>
					<li>Prioritize work by risk, business impact, timeline, and budget</li>
					<li>Use remote delivery where practical and onsite coordination when needed</li>
					<li>Document decisions so support is easier later</li>
				</ul>
			</div>
		</div>
	</div>
</section>

<section class="bg-slate-50 px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl">
		<h2 class="text-3xl font-semibold tracking-tight">Related services</h2>
		<div class="mt-6 grid gap-6 md:grid-cols-3">
			{#each relatedServices as service}
				<ServiceCard {service} />
			{/each}
		</div>
	</div>
</section>

<CTA
	title={`Talk to H2 Technologies about ${location.title.toLowerCase()}.`}
	description="Share your current environment, priorities, and timeline. We will help you identify the most practical next step."
	primaryLabel="Talk to an Engineer"
/>
