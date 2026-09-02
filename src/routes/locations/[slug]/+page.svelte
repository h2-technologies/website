<script lang="ts">
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import CTA from '$lib/components/CTA.svelte';
	import FaqBlock from '$lib/components/FaqBlock.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import { type LocationPage } from '$lib/locations';
	import { services } from '$lib/services';
	import { absoluteUrl, site } from '$lib/site';

	let { data } = $props<{ data: { location: LocationPage } }>();

	const location = $derived(data.location);
	const path = $derived(`/locations/${location.slug}`);
	const relatedServices = $derived(
		location.serviceSlugs.map((slug: string) => services.find((service) => service.slug === slug)!)
	);
	const sectionId = (heading: string) =>
		heading
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');

	const areaSchema = $derived({
		'@type': location.area.schemaType,
		name: location.area.name,
		...(location.area.containedIn
			? { containedInPlace: { '@type': 'AdministrativeArea', name: location.area.containedIn } }
			: {})
	});
	const serviceSchema = $derived({
		'@type': 'Service',
		'@id': `${absoluteUrl(path)}#service`,
		name: location.title,
		description: location.meta,
		url: absoluteUrl(path),
		provider: { '@id': `${site.url}/#organization` },
		areaServed: areaSchema,
		hasOfferCatalog: {
			'@type': 'OfferCatalog',
			name: `${location.title} services`,
			itemListElement: location.serviceSlugs.map((slug: string, index: number) => ({
				'@type': 'Offer',
				position: index + 1,
				itemOffered: {
					'@type': 'Service',
					name: services.find((service) => service.slug === slug)!.title,
					url: absoluteUrl(`/services/${slug}`)
				}
			}))
		}
	});
	const faqSchema = $derived({
		'@type': 'FAQPage',
		'@id': `${absoluteUrl(path)}#faq`,
		mainEntity: location.faqs.map((faq: { question: string; answer: string }) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: { '@type': 'Answer', text: faq.answer }
		}))
	});
	const breadcrumbSchema = $derived({
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
			{ '@type': 'ListItem', position: 2, name: 'Service areas', item: absoluteUrl('/locations') },
			{ '@type': 'ListItem', position: 3, name: location.title, item: absoluteUrl(path) }
		]
	});
</script>

<Seo
	title={location.seoTitle}
	description={location.meta}
	{path}
	schema={[serviceSchema, faqSchema, breadcrumbSchema]}
/>

<section class="bg-slate-950 px-6 py-20 text-white sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl">
		<Breadcrumbs
			items={[
				{ name: 'Home', href: '/' },
				{ name: 'Service areas', href: '/locations' },
				{ name: location.title, href: path }
			]}
		/>
		<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">
			{location.eyebrow}
		</p>
		<h1 class="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
			{location.h1}
		</h1>
		<p class="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{location.intro}</p>
		{#if location.area.containedIn}
			<p class="mt-4 text-sm text-slate-400">
				Serving {location.area.name} and the surrounding {location.area.containedIn} area.
			</p>
		{/if}
		<div class="mt-8">
			<a
				href="/contact"
				class="inline-flex min-h-12 items-center justify-center rounded-lg bg-orange-700 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-950/30 transition hover:-translate-y-0.5 hover:bg-orange-800"
			>
				Request a Technology Assessment
			</a>
		</div>
	</div>
</section>

<section class="bg-white px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto max-w-4xl">
		{#each location.sections as section}
			<div class="mt-14 first:mt-0">
				<h2
					id={sectionId(section.heading)}
					class="scroll-mt-28 text-3xl font-semibold tracking-tight text-slate-950"
				>
					{section.heading}
				</h2>
				{#each section.paragraphs as paragraph}
					<p class="mt-5 text-lg leading-8 text-slate-700">{paragraph}</p>
				{/each}
				{#if section.bullets}
					<ul class="mt-6 space-y-3 pl-6 text-lg leading-8 text-slate-700 marker:text-orange-700">
						{#each section.bullets as bullet}
							<li class="list-disc pl-1">{bullet}</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}

		{#if location.area.nearby?.length}
			<div class="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6">
				<h2 class="text-2xl font-semibold tracking-tight">
					Communities served around {location.area.name}
				</h2>
				<p class="mt-3 leading-7 text-slate-700">
					{location.area.containedIn} coverage includes {location.area.nearby.join(', ')}, and the
					surrounding communities. Remote work is delivered anywhere in Ohio and beyond.
				</p>
			</div>
		{/if}
	</div>
</section>

<section class="bg-slate-50 px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl">
		<h2 class="text-3xl font-semibold tracking-tight">
			Services most requested in {location.area.name}
		</h2>
		<div class="mt-6 grid gap-6 md:grid-cols-3">
			{#each relatedServices as service}
				<ServiceCard {service} />
			{/each}
		</div>
		<p class="mt-8 leading-7 text-slate-600">
			These are the most common starting points, not the full list.
			<a class="font-semibold text-orange-700 hover:text-orange-800" href="/services"
				>Browse every consulting service</a
			>
			or read the
			<a class="font-semibold text-orange-700 hover:text-orange-800" href="/resources"
				>technical guides</a
			> that explain how these decisions are usually made.
		</p>
	</div>
</section>

<section class="bg-white px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto max-w-4xl">
		<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-700">FAQ</p>
		<h2 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
			Questions about {location.title.toLowerCase()}
		</h2>
		<div class="mt-8">
			<FaqBlock faqs={location.faqs} />
		</div>
	</div>
</section>

<CTA
	title={`Talk to H2 Technologies about ${location.title.toLowerCase()}.`}
	description="Share your current environment, priorities, and timeline. We will help you identify the most practical next step."
	primaryLabel="Talk to an Engineer"
/>
