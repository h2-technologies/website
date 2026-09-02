<script lang="ts">
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import CTA from '$lib/components/CTA.svelte';
	import FaqBlock from '$lib/components/FaqBlock.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { allFaqItems, faqGroups } from '$lib/faqs';
	import { absoluteUrl, site } from '$lib/site';

	const path = '/faq';
	const faqSchema = {
		'@type': 'FAQPage',
		'@id': `${absoluteUrl(path)}#faq`,
		url: absoluteUrl(path),
		name: 'H2 Technologies frequently asked questions',
		isPartOf: { '@id': `${site.url}/#website` },
		about: { '@id': `${site.url}/#organization` },
		mainEntity: allFaqItems.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: { '@type': 'Answer', text: item.answer }
		}))
	};
	const breadcrumbSchema = {
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
			{ '@type': 'ListItem', position: 2, name: 'FAQ', item: absoluteUrl(path) }
		]
	};
</script>

<Seo
	title="Frequently Asked Questions | H2 Technologies LLC"
	description="Answers about how H2 Technologies scopes and prices engagements, works remotely or onsite in Ohio, and handles network, routing, and security work."
	{path}
	schema={[faqSchema, breadcrumbSchema]}
/>

<section class="bg-slate-950 px-6 py-20 text-white sm:px-8 lg:px-12">
	<div class="mx-auto max-w-4xl">
		<Breadcrumbs
			items={[
				{ name: 'Home', href: '/' },
				{ name: 'FAQ', href: path }
			]}
		/>
		<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">FAQ</p>
		<h1 class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
			Questions worth answering before you call.
		</h1>
		<p class="mt-6 text-lg leading-8 text-slate-300">
			These are the questions that come up most often in first conversations, answered directly.
			Where the honest answer is “it depends,” that is stated along with what it depends on.
		</p>
		<nav aria-label="Question categories" class="mt-8 flex flex-wrap gap-3">
			{#each faqGroups as group}
				<a
					class="inline-flex rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:border-white/30 hover:bg-white/10"
					href={`#${group.id}`}>{group.title}</a
				>
			{/each}
		</nav>
	</div>
</section>

{#each faqGroups as group, index}
	<section
		class={`px-6 py-16 text-slate-900 sm:px-8 lg:px-12 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
	>
		<div class="mx-auto max-w-4xl">
			<h2 id={group.id} class="scroll-mt-28 text-3xl font-semibold tracking-tight">
				{group.title}
			</h2>
			<p class="mt-3 text-lg leading-8 text-slate-600">{group.description}</p>
			<div class="mt-8">
				<FaqBlock faqs={group.items} />
			</div>
		</div>
	</section>
{/each}

<section class="bg-white px-6 pb-16 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-slate-50 p-6">
		<h2 class="text-2xl font-semibold tracking-tight">Still looking for something specific?</h2>
		<p class="mt-4 leading-7 text-slate-700">
			Each <a class="font-semibold text-orange-700 hover:text-orange-800" href="/services"
				>service page</a
			>
			carries its own questions, the
			<a class="font-semibold text-orange-700 hover:text-orange-800" href="/resources"
				>technical guides</a
			>
			work through individual decisions in depth, and the
			<a class="font-semibold text-orange-700 hover:text-orange-800" href="/locations"
				>service area pages</a
			> cover how local and remote work is handled in each county.
		</p>
	</div>
</section>

<CTA
	title="Have a question that is not answered here?"
	description="Describe the situation and what you are trying to improve. You will get a direct answer about whether this is work H2 Technologies should take on."
	primaryLabel="Talk to an Engineer"
/>
