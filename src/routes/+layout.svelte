<script lang="ts">
	import '../app.css';
	import { footerLocations, footerServices, site } from '$lib/site';

	let { children } = $props();
</script>

<svelte:head>
	<script defer src="/analytics.js"></script>
</svelte:head>

<div class="min-h-screen bg-white text-slate-900">
	<a
		href="#main-content"
		class="sr-only z-50 rounded-lg bg-slate-950 px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
	>
		Skip to content
	</a>

	<header class="z-40 border-b border-slate-200 bg-white/95 backdrop-blur lg:sticky lg:top-0">
		<nav
			aria-label="Primary navigation"
			class="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12"
		>
			<a href="/" class="inline-flex items-center">
				<img
					src="/wideLogo.png"
					class="h-12 w-auto"
					width="320"
					height="80"
					alt="H2 Technologies LLC"
				/>
			</a>
			<div class="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-semibold text-slate-700">
				<a class="hover:text-orange-700" href="/services">Services</a>
				<a class="hover:text-orange-700" href="/locations/it-services-ohio">Ohio IT</a>
				<a class="hover:text-orange-700" href="/resources">Resources</a>
				<a class="hover:text-orange-700" href="/about">About</a>
				<a
					href="/contact"
					class="inline-flex min-h-11 items-center justify-center rounded-lg bg-orange-700 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-orange-800"
				>
					Talk to an Engineer
				</a>
			</div>
		</nav>
	</header>

	<main id="main-content" tabindex="-1">
		{@render children()}
	</main>

	<footer class="bg-slate-950 px-6 py-12 text-left text-slate-300 sm:px-8 lg:px-12">
		<div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
			<div>
				<img
					src="/wideLogo.png"
					class="h-12 w-auto rounded bg-white p-1"
					width="320"
					height="80"
					alt="H2 Technologies LLC"
					loading="lazy"
					decoding="async"
				/>
				<p class="mt-4 max-w-sm text-sm leading-7">
					Ohio-based, remote-capable technology consulting for secure software, enterprise networks,
					cybersecurity, productivity platforms, and practical business IT support.
				</p>
				<p class="mt-4 text-sm">
					&copy; {new Date().getFullYear()} H2 Technologies LLC. All rights reserved.
				</p>
			</div>
			<div>
				<h2 class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">Services</h2>
				<div class="mt-4 grid gap-2 text-sm">
					{#each footerServices as service}
						<a class="hover:text-white" href={`/services/${service.slug}`}>{service.title}</a>
					{/each}
					<a class="font-semibold text-white hover:text-orange-200" href="/services"
						>View all services</a
					>
				</div>
			</div>
			<div>
				<h2 class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">Ohio</h2>
				<div class="mt-4 grid gap-2 text-sm">
					{#each footerLocations as location}
						<a class="hover:text-white" href={`/locations/${location.slug}`}>{location.title}</a>
					{/each}
				</div>
			</div>
			<div>
				<h2 class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">Contact</h2>
				<div class="mt-4 grid gap-2 text-sm">
					<a class="hover:text-white" href="/contact">Request a Technology Assessment</a>
					<a class="hover:text-white" href={site.contactHref}>Schedule a Free Consultation</a>
					<a class="hover:text-white" href="/routing">BGP Routing Policy</a>
					<a class="hover:text-white" href="/sitemap.xml">Sitemap</a>
				</div>
			</div>
		</div>
	</footer>
</div>
