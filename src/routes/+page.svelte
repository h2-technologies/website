<script lang="ts">
	import CTA from '$lib/components/CTA.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import TrustSection from '$lib/components/TrustSection.svelte';
	import { posts } from '$lib/posts';
	import { services } from '$lib/services';
	import { site, trustPoints } from '$lib/site';

	const featuredServices = [
		'custom-software-development',
		'business-website-development',
		'enterprise-network-design',
		'cybersecurity-consulting',
		'google-workspace-administration',
		'fortinet-firewall-consulting'
	].map((slug) => services.find((service) => service.slug === slug)!);

	const projectTypes = [
		'Website redesigns with stronger service pages and lead flow',
		'Fortinet firewall review, VPN planning, and segmentation',
		'Google Workspace setup, administration, and email security',
		'BGP, public ASN, IPv6, and multi-site network planning',
		'Custom portals, workflow tools, dashboards, and integrations',
		'Disaster recovery planning and infrastructure documentation'
	];
</script>

<Seo
	title="H2 Technologies LLC | Secure Software, Enterprise Networks, and Practical IT Solutions"
	description={site.description}
	path="/"
/>

<section class="relative overflow-hidden bg-slate-950 text-white">
	<div class="absolute inset-0 bg-[url(/herobackground.jpg)] bg-cover bg-center opacity-25"></div>
	<div
		class="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/76 to-slate-950"
	></div>
	<div class="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
		<div class="max-w-4xl">
			<p class="text-sm font-semibold uppercase tracking-[0.24em] text-orange-300">
				Ohio-based technology consulting
			</p>
			<h1 class="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-7xl">
				Secure Software, Enterprise Networks, and Practical IT Solutions for Growing Businesses
			</h1>
			<p class="mt-6 max-w-3xl text-lg leading-8 text-slate-200 sm:text-xl">
				H2 Technologies helps businesses build secure websites, custom software, reliable networks,
				Google Workspace environments, Fortinet security stacks, and scalable infrastructure.
			</p>
			<div class="mt-8 flex flex-col gap-4 sm:flex-row">
				<a
					href="/contact/"
					class="inline-flex min-h-12 items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-950/30 transition hover:-translate-y-0.5 hover:bg-orange-400"
				>
					Schedule a Free Consultation
				</a>
				<a
					href="/services/"
					class="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
				>
					Explore Services
				</a>
			</div>
		</div>

		<div
			class="mt-12 grid overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur sm:grid-cols-2 lg:grid-cols-6"
		>
			{#each trustPoints as point}
				<div
					class="border-b border-r border-white/10 p-4 text-sm font-semibold text-slate-100 lg:border-b-0"
				>
					{point}
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="bg-slate-50 px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl">
		<div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
			<div class="max-w-3xl">
				<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">Services</p>
				<h2 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
					Specific consulting services for build, security, networking, and support.
				</h2>
				<p class="mt-4 text-lg leading-8 text-slate-600">
					Start with a focused need or combine services into a larger technology roadmap.
				</p>
			</div>
			<a class="font-semibold text-orange-700 hover:text-orange-800" href="/services/"
				>View all services →</a
			>
		</div>
		<div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
			{#each featuredServices as service}
				<ServiceCard {service} />
			{/each}
		</div>
	</div>
</section>

<TrustSection />

<section class="bg-slate-50 px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
		<div>
			<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">
				Business outcomes
			</p>
			<h2 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
				Security-first architecture without losing sight of daily operations.
			</h2>
			<p class="mt-4 text-lg leading-8 text-slate-600">
				Good technology consulting should reduce risk, improve reliability, make support easier, and
				help leaders make clearer decisions.
			</p>
		</div>
		<div class="grid gap-4 sm:grid-cols-2">
			{#each projectTypes as type}
				<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
					<p class="font-semibold leading-7 text-slate-800">{type}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="bg-white px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl">
		<div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
			<div class="max-w-3xl">
				<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-600">Resources</p>
				<h2 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
					Practical guides for technology decisions.
				</h2>
				<p class="mt-4 text-lg leading-8 text-slate-600">
					Starter resources explain common decisions in plain language and link back to the services
					that can help.
				</p>
			</div>
			<a class="font-semibold text-orange-700 hover:text-orange-800" href="/resources/"
				>View resources →</a
			>
		</div>
		<div class="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
			{#each posts.slice(0, 4) as post}
				<article class="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm">
					<h3 class="text-xl font-semibold tracking-tight">{post.title}</h3>
					<p class="mt-3 text-sm leading-7 text-slate-600">{post.summary}</p>
					<a
						class="mt-5 inline-flex font-semibold text-orange-700"
						href={`/resources/${post.slug}/`}>Read guide →</a
					>
				</article>
			{/each}
		</div>
	</div>
</section>

<CTA />
