<script lang="ts">
	import CTA from '$lib/components/CTA.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { locations, placePages, serviceAreaPages } from '$lib/locations';
	import { absoluteUrl, site } from '$lib/site';

	const path = '/locations';
	const groups = [
		{
			id: 'communities-we-serve',
			title: 'Communities we serve',
			description:
				'H2 Technologies is based in Ashland, Ohio. These pages cover the counties where onsite work is a routine part of an engagement rather than a special arrangement.',
			pages: placePages
		},
		{
			id: 'statewide-consulting',
			title: 'Statewide consulting by specialty',
			description:
				'Most consulting work is delivered remotely to businesses anywhere in Ohio. These pages cover a single specialty in depth rather than a single town.',
			pages: serviceAreaPages
		}
	];

	const collectionSchema = {
		'@type': 'CollectionPage',
		'@id': `${absoluteUrl(path)}#webpage`,
		url: absoluteUrl(path),
		name: 'Ohio service areas',
		description:
			'Communities and consulting specialties covered by H2 Technologies across Ohio, from its base in Ashland.',
		isPartOf: { '@id': `${site.url}/#website` },
		about: { '@id': `${site.url}/#organization` }
	};
	const itemListSchema = {
		'@type': 'ItemList',
		'@id': `${absoluteUrl(path)}#list`,
		itemListElement: locations.map((location, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: location.title,
			url: absoluteUrl(`/locations/${location.slug}`)
		}))
	};
	const breadcrumbSchema = {
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
			{ '@type': 'ListItem', position: 2, name: 'Service areas', item: absoluteUrl(path) }
		]
	};
</script>

<Seo
	title="Ohio Service Areas | H2 Technologies LLC"
	description="H2 Technologies serves Ashland, Mansfield, Wooster, and businesses across Ohio with IT support, network engineering, and cybersecurity consulting."
	{path}
	schema={[collectionSchema, itemListSchema, breadcrumbSchema]}
/>

<section class="bg-slate-950 px-6 py-20 text-white sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl">
		<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">
			Ohio technology partner
		</p>
		<h1 class="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
			Based in Ashland, working across Ohio.
		</h1>
		<p class="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
			H2 Technologies is an Ashland, Ohio business. Onsite work centers on Ashland, Richland, and
			Wayne counties, while network, cloud, security, and software engagements are delivered
			remotely to organizations anywhere in Ohio.
		</p>
	</div>
</section>

{#each groups as group, groupIndex}
	<section
		id={group.id}
		class={`px-6 py-20 text-slate-900 sm:px-8 lg:px-12 ${
			groupIndex % 2 === 0 ? 'bg-slate-50' : 'bg-white'
		}`}
	>
		<div class="mx-auto max-w-7xl">
			<h2 class="text-3xl font-semibold tracking-tight sm:text-4xl">{group.title}</h2>
			<p class="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{group.description}</p>
			<div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
				{#each group.pages as location}
					<article class="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
						<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-700">
							{location.eyebrow}
						</p>
						<h3 class="mt-3 text-2xl font-semibold tracking-tight">{location.title}</h3>
						<p class="mt-3 leading-7 text-slate-600">{location.meta}</p>
						<a
							class="mt-5 inline-flex font-semibold text-orange-700 hover:text-orange-800"
							href={`/locations/${location.slug}`}>Learn more →</a
						>
					</article>
				{/each}
			</div>
		</div>
	</section>
{/each}

<CTA />
