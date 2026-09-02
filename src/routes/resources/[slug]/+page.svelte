<script lang="ts">
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import CTA from '$lib/components/CTA.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import { type Post } from '$lib/posts';
	import { services } from '$lib/services';
	import { absoluteUrl, founder, site } from '$lib/site';

	let { data } = $props<{ data: { post: Post } }>();

	const post = $derived(data.post);
	const path = $derived(`/resources/${post.slug}`);
	const relatedServices = $derived(
		post.relatedServices.map((slug: string) => services.find((service) => service.slug === slug)!)
	);
	const sectionId = (heading: string) =>
		heading
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
	const formatDate = (date: string) =>
		new Intl.DateTimeFormat('en-US', {
			dateStyle: 'long',
			timeZone: 'UTC'
		}).format(new Date(`${date}T00:00:00Z`));
	const articleSchema = $derived({
		'@type': 'TechArticle',
		'@id': `${absoluteUrl(path)}#article`,
		headline: post.title,
		description: post.meta,
		url: absoluteUrl(path),
		mainEntityOfPage: { '@id': absoluteUrl(path) },
		image: {
			'@type': 'ImageObject',
			url: absoluteUrl(site.socialImage),
			width: 4288,
			height: 2848
		},
		datePublished: post.publishedAt,
		dateModified: post.updatedAt,
		inLanguage: 'en-US',
		author: { '@id': `${site.url}/#founder` },
		publisher: { '@id': `${site.url}/#organization` }
	});
	const breadcrumbSchema = $derived({
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
			{ '@type': 'ListItem', position: 2, name: 'Resources', item: absoluteUrl('/resources') },
			{ '@type': 'ListItem', position: 3, name: post.title, item: absoluteUrl(path) }
		]
	});
</script>

<Seo
	title={post.seoTitle}
	description={post.meta}
	{path}
	type="article"
	publishedTime={post.publishedAt}
	modifiedTime={post.updatedAt}
	schema={[articleSchema, breadcrumbSchema]}
/>

<article>
	<section class="bg-slate-950 px-6 py-20 text-white sm:px-8 lg:px-12">
		<div class="mx-auto max-w-4xl">
			<Breadcrumbs
				items={[
					{ name: 'Home', href: '/' },
					{ name: 'Resources', href: '/resources' },
					{ name: post.title, href: path }
				]}
			/>
			<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">Guide</p>
			<h1 class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
				{post.title}
			</h1>
			<p class="mt-6 text-lg leading-8 text-slate-300">{post.summary}</p>
			<p class="mt-5 text-sm text-slate-400">
				By
				<a class="font-semibold text-orange-300 hover:text-orange-200" href="/about" rel="author"
					>{founder.name}</a
				>, {founder.jobTitle}
				<span aria-hidden="true"> · </span>
				Published <time datetime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
				<span aria-hidden="true"> · </span>
				Updated <time datetime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
			</p>
		</div>
	</section>

	<section class="bg-white px-6 py-16 text-slate-900 sm:px-8 lg:px-12">
		<div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(14rem,0.6fr)_minmax(0,1.4fr)]">
			<aside
				class="self-start rounded-2xl border border-slate-200 bg-slate-50 p-6 lg:sticky lg:top-28"
			>
				<nav aria-labelledby="guide-contents-heading">
					<h2 id="guide-contents-heading" class="text-xl font-semibold">Table of contents</h2>
					<ol class="mt-4 space-y-3 text-slate-700">
						{#each post.sections as section, index}
							<li>
								<a
									class="inline-flex gap-2 font-medium text-orange-800 underline decoration-orange-300 underline-offset-4 hover:text-orange-950"
									href={`#${sectionId(section.heading)}`}
								>
									<span class="text-slate-500" aria-hidden="true">{index + 1}.</span>
									<span>{section.heading}</span>
								</a>
							</li>
						{/each}
					</ol>
				</nav>
			</aside>
			<div class="min-w-0">
				<p class="text-xl leading-8 text-slate-700">{post.summary}</p>
				{#each post.sections as section}
					<section class="mt-12" aria-labelledby={sectionId(section.heading)}>
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
							<ul
								class="mt-6 space-y-3 pl-6 text-lg leading-8 text-slate-700 marker:text-orange-700"
							>
								{#each section.bullets as bullet}
									<li class="list-disc pl-1">{bullet}</li>
								{/each}
							</ul>
						{/if}
					</section>
				{/each}
			</div>
		</div>
	</section>
</article>

<section class="bg-slate-50 px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl">
		<h2 class="text-3xl font-semibold tracking-tight">Related services</h2>
		<div class="mt-6 grid gap-6 md:grid-cols-2">
			{#each relatedServices as service}
				<ServiceCard {service} />
			{/each}
		</div>
	</div>
</section>

<CTA
	title="Need help turning this guidance into an action plan?"
	description="H2 Technologies can review your environment, clarify the technical options, and help prioritize the next step."
	primaryLabel="Request a Technology Assessment"
/>
