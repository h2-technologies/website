<script lang="ts">
	import CTA from '$lib/components/CTA.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { posts } from '$lib/posts';
	import { absoluteUrl, founder, site } from '$lib/site';

	const path = '/resources';
	const formatDate = (date: string) =>
		new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' }).format(
			new Date(`${date}T00:00:00Z`)
		);

	const blogSchema = {
		'@type': 'Blog',
		'@id': `${absoluteUrl(path)}#blog`,
		url: absoluteUrl(path),
		name: 'H2 Technologies technical guides',
		description:
			'Guides on firewalls, productivity platforms, BGP, IPv6, remote access, website redesigns, disaster recovery, and IT support models.',
		isPartOf: { '@id': `${site.url}/#website` },
		publisher: { '@id': `${site.url}/#organization` },
		author: { '@id': `${site.url}/#founder` },
		blogPost: posts.map((post) => ({
			'@type': 'TechArticle',
			'@id': `${absoluteUrl(`/resources/${post.slug}`)}#article`,
			headline: post.title,
			description: post.meta,
			url: absoluteUrl(`/resources/${post.slug}`),
			datePublished: post.publishedAt,
			dateModified: post.updatedAt,
			author: { '@id': `${site.url}/#founder` }
		}))
	};
	const breadcrumbSchema = {
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
			{ '@type': 'ListItem', position: 2, name: 'Resources', item: absoluteUrl(path) }
		]
	};
</script>

<Seo
	title="Technology Resources for Business Owners | H2 Technologies LLC"
	description="Practical guides on firewalls, Google Workspace, Microsoft 365, BGP, IPv6, remote work, website redesigns, disaster recovery, and managed IT."
	{path}
	schema={[blogSchema, breadcrumbSchema]}
/>

<section class="bg-slate-950 px-6 py-20 text-white sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl">
		<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">Resources</p>
		<h1 class="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
			Practical guides for business technology decisions.
		</h1>
		<p class="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
			Use these guides to frame decisions around security, collaboration, networking, websites,
			recovery planning, and IT support. Each one is written by
			<a class="font-semibold text-orange-300 hover:text-orange-200" href="/about">{founder.name}</a
			> to be useful whether or not you hire anyone.
		</p>
	</div>
</section>

<section class="bg-slate-50 px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-4">
		{#each posts as post}
			<article class="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
				<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-700">Guide</p>
				<h2 class="mt-3 text-2xl font-semibold tracking-tight">{post.title}</h2>
				<p class="mt-2 text-xs text-slate-500">
					Updated <time datetime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
				</p>
				<p class="mt-3 text-sm leading-7 text-slate-600">{post.summary}</p>
				<a class="mt-5 inline-flex font-semibold text-orange-700" href={`/resources/${post.slug}`}
					>Read guide →</a
				>
			</article>
		{/each}
	</div>
</section>

<CTA />
