<script lang="ts">
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import CTA from '$lib/components/CTA.svelte';
	import FaqBlock from '$lib/components/FaqBlock.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import { locationsForService } from '$lib/locations';
	import { services, type Service } from '$lib/services';
	import { absoluteUrl, site } from '$lib/site';

	let { data } = $props<{ data: { service: Service } }>();

	const service = $derived(data.service);
	const serviceAreas = $derived(locationsForService(service.slug));
	const related = $derived(
		service.related
			.map((slug: string) => services.find((item) => item.slug === slug))
			.filter(Boolean) as Service[]
	);
	const path = $derived(`/services/${service.slug}`);
	const serviceSchema = $derived({
		'@type': 'Service',
		'@id': `${absoluteUrl(path)}#service`,
		name: service.title,
		description: service.meta,
		provider: { '@id': `${site.url}/#organization` },
		areaServed: site.areaServed,
		serviceType: service.title,
		url: absoluteUrl(path)
	});
	const faqSchema = $derived({
		'@type': 'FAQPage',
		mainEntity: service.faqs.map((faq: { question: string; answer: string }) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer
			}
		}))
	});
	const breadcrumbSchema = $derived({
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
			{ '@type': 'ListItem', position: 2, name: 'Services', item: absoluteUrl('/services') },
			{ '@type': 'ListItem', position: 3, name: service.title, item: absoluteUrl(path) }
		]
	});
</script>

<Seo
	title={service.seoTitle}
	description={service.meta}
	{path}
	schema={[serviceSchema, faqSchema, breadcrumbSchema]}
/>

<section class="bg-slate-950 px-6 py-20 text-white sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl">
		<Breadcrumbs
			items={[
				{ name: 'Home', href: '/' },
				{ name: 'Services', href: '/services' },
				{ name: service.title, href: path }
			]}
		/>
		<div class="max-w-4xl">
			<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">Service</p>
			<h1 class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
				{service.h1}
			</h1>
			<p class="mt-6 max-w-3xl text-lg leading-8 text-slate-300">{service.intro}</p>
			<div class="mt-8 flex flex-col gap-4 sm:flex-row">
				<a
					href="/contact"
					class="inline-flex min-h-12 items-center justify-center rounded-lg bg-orange-700 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-950/30 transition hover:-translate-y-0.5 hover:bg-orange-800"
				>
					Request a Technology Assessment
				</a>
				<a
					href="/services"
					class="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
				>
					Explore Services
				</a>
			</div>
		</div>
	</div>
</section>

<section class="bg-white px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.75fr_1.25fr]">
		<aside class="rounded-2xl border border-slate-200 bg-slate-50 p-6">
			<h2 class="text-2xl font-semibold tracking-tight">Who this is for</h2>
			<ul class="mt-5 space-y-3 text-left text-slate-700">
				{#each service.audience as item}
					<li class="flex gap-3">
						<span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-700"></span>{item}
					</li>
				{/each}
			</ul>
		</aside>
		<div class="grid gap-8">
			<div>
				<h2 class="text-3xl font-semibold tracking-tight">Problems solved</h2>
				<div class="mt-5 grid gap-4 sm:grid-cols-2">
					{#each service.problems as item}
						<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">{item}</div>
					{/each}
				</div>
			</div>
			<div>
				<h2 class="text-3xl font-semibold tracking-tight">Benefits</h2>
				<div class="mt-5 grid gap-4 sm:grid-cols-2">
					{#each service.benefits as item}
						<div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">{item}</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</section>

<section class="bg-slate-50 px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
		<div>
			<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-700">Process</p>
			<h2 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
				A clear path from assessment to implementation.
			</h2>
			<p class="mt-4 text-lg leading-8 text-slate-600">
				Every engagement is scoped around the outcome, risk level, budget, and timeline before
				implementation begins.
			</p>
		</div>
		<ol class="grid gap-4">
			{#each service.process as step, index}
				<li class="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
					<span
						class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-semibold text-white"
					>
						0{index + 1}
					</span>
					<span class="pt-2 font-medium text-slate-700">{step}</span>
				</li>
			{/each}
		</ol>
	</div>
</section>

<section class="bg-white px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto max-w-4xl">
		<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-700">FAQ</p>
		<h2 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
			Common questions about {service.title}
		</h2>
		<div class="mt-8">
			<FaqBlock faqs={service.faqs} />
		</div>
	</div>
</section>

<section class="bg-slate-50 px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl">
		<h2 class="text-3xl font-semibold tracking-tight">Related services</h2>
		<div class="mt-6 grid gap-6 md:grid-cols-3">
			{#each related as relatedService}
				<ServiceCard service={relatedService} />
			{/each}
		</div>
	</div>
</section>

{#if serviceAreas.length}
	<section class="bg-white px-6 py-16 text-slate-900 sm:px-8 lg:px-12">
		<div class="mx-auto max-w-7xl">
			<h2 class="text-2xl font-semibold tracking-tight">
				Where {service.title.toLowerCase()} is delivered
			</h2>
			<p class="mt-3 max-w-3xl leading-7 text-slate-600">
				H2 Technologies is based in Ashland, Ohio. This work is delivered remotely across Ohio and
				nationally, with onsite coordination where the task requires it.
			</p>
			<ul class="mt-5 flex flex-wrap gap-3">
				{#each serviceAreas.slice(0, 4) as area}
					<li>
						<a
							class="inline-flex rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-orange-700 transition hover:border-orange-200 hover:text-orange-800"
							href={`/locations/${area.slug}`}>{area.title}</a
						>
					</li>
				{/each}
				<li>
					<a
						class="inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
						href="/locations">All service areas</a
					>
				</li>
			</ul>
		</div>
	</section>
{/if}

<CTA
	title={`Talk to an engineer about ${service.title.toLowerCase()}.`}
	description="Share the current situation, what needs to improve, and any timeline or budget constraints. H2 Technologies will help define the next practical step."
	primaryLabel="Talk to an Engineer"
/>
