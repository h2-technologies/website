<script lang="ts">
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import CTA from '$lib/components/CTA.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import { type Post } from '$lib/posts';
	import { services } from '$lib/services';
	import { absoluteUrl, site } from '$lib/site';

	let { data } = $props<{ data: { post: Post } }>();

	const post = $derived(data.post);
	const path = $derived(`/resources/${post.slug}/`);
	const relatedServices = $derived(
		post.relatedServices.map((slug: string) => services.find((service) => service.slug === slug)!)
	);
	const articleSchema = $derived({
		'@type': 'Article',
		headline: post.title,
		description: post.meta,
		url: absoluteUrl(path),
		author: { '@id': `${site.url}/#organization` },
		publisher: { '@id': `${site.url}/#organization` }
	});
</script>

<Seo title={post.seoTitle} description={post.meta} {path} schema={[articleSchema]} />

<article>
	<section class="bg-slate-950 px-6 py-20 text-white sm:px-8 lg:px-12">
		<div class="mx-auto max-w-4xl">
			<Breadcrumbs
				items={[
					{ name: 'Home', href: '/' },
					{ name: 'Resources', href: '/resources/' },
					{ name: post.title, href: path }
				]}
			/>
			<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">Guide</p>
			<h1 class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
				{post.title}
			</h1>
			<p class="mt-6 text-lg leading-8 text-slate-300">{post.summary}</p>
		</div>
	</section>

	<section class="bg-white px-6 py-16 text-slate-900 sm:px-8 lg:px-12">
		<div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr]">
			<aside class="rounded-2xl border border-slate-200 bg-slate-50 p-6">
				<h2 class="text-xl font-semibold">Table of contents</h2>
				<ol class="mt-4 space-y-3 text-slate-700">
					{#each post.toc as item}
						<li>
							<a
								class="font-medium text-orange-700"
								href={`#${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</a
							>
						</li>
					{/each}
				</ol>
			</aside>
			<div class="prose max-w-none">
				<h2>Summary</h2>
				<p>{post.summary}</p>
				{#each post.toc as item}
					<h2 id={item.toLowerCase().replaceAll(' ', '-')}>{item}</h2>
					<p>
						Use this section as a starter framework for evaluating {item.toLowerCase()} in the context
						of your business, users, risk level, budget, and support expectations. The best decision is
						usually the one your team can operate consistently after launch.
					</p>
					<p>
						For a stronger plan, document the current state, decision owner, technical dependencies,
						security considerations, and how success will be measured after implementation.
					</p>
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
