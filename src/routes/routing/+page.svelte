<script lang="ts">
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { policyIntro, policySections } from '$lib/routing-policy';
	import { absoluteUrl, founder, network, site } from '$lib/site';

	const path = '/routing';
	const articleSchema = {
		'@type': 'TechArticle',
		'@id': `${absoluteUrl(path)}#article`,
		headline: 'AS17290 BGP Routing Policy',
		description:
			'Route acceptance, peering, transit onboarding, and outbound announcement policy for AS17290.',
		url: absoluteUrl(path),
		mainEntityOfPage: { '@id': absoluteUrl(path) },
		inLanguage: 'en-US',
		author: { '@id': `${site.url}/#founder` },
		publisher: { '@id': `${site.url}/#organization` },
		about: {
			'@type': 'ComputerLanguage',
			name: 'Border Gateway Protocol'
		},
		audience: {
			'@type': 'Audience',
			audienceType: 'Network operators, peering coordinators, and transit providers'
		}
	};
	const breadcrumbSchema = {
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
			{ '@type': 'ListItem', position: 2, name: 'AS17290 routing policy', item: absoluteUrl(path) }
		]
	};
</script>

<Seo
	title="AS17290 BGP Routing Policy | H2 Technologies LLC"
	description="The AS17290 routing policy: RPKI, IRR, and LOA validation for inbound routes, requirements for peering and transit onboarding, and outbound announcements."
	{path}
	schema={[articleSchema, breadcrumbSchema]}
/>

<section class="bg-slate-950 px-6 py-16 text-white sm:px-8 lg:px-12">
	<div class="mx-auto max-w-4xl">
		<Breadcrumbs
			items={[
				{ name: 'Home', href: '/' },
				{ name: 'AS17290 routing policy', href: path }
			]}
		/>
		<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">Routing policy</p>
		<h1 class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
			AS17290 BGP Routing Policy
		</h1>
		<p class="mt-6 text-lg leading-8 text-slate-300">{policyIntro}</p>
		<dl class="mt-8 grid gap-4 sm:grid-cols-3">
			<div class="rounded-2xl border border-white/10 bg-white/5 p-5">
				<dt class="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">ASN</dt>
				<dd class="mt-2 font-mono text-lg">{network.asn}</dd>
			</div>
			<div class="rounded-2xl border border-white/10 bg-white/5 p-5">
				<dt class="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">AS-SET</dt>
				<dd class="mt-2 break-all font-mono text-lg">{network.asSet}</dd>
			</div>
			<div class="rounded-2xl border border-white/10 bg-white/5 p-5">
				<dt class="text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">Operator</dt>
				<dd class="mt-2 text-lg">{network.registrant}</dd>
			</div>
		</dl>
	</div>
</section>

<section class="bg-white px-6 py-16 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto max-w-4xl">
		<nav
			aria-labelledby="policy-contents-heading"
			class="rounded-2xl border border-slate-200 bg-slate-50 p-6"
		>
			<h2 id="policy-contents-heading" class="text-xl font-semibold">Policy contents</h2>
			<ol class="mt-4 grid gap-2 text-slate-700 sm:grid-cols-2">
				{#each policySections as section}
					<li>
						<a
							class="font-medium text-orange-800 underline decoration-orange-300 underline-offset-4 hover:text-orange-950"
							href={`#${section.id}`}
						>
							<span class="text-slate-500" aria-hidden="true">{section.number}.</span>
							{section.heading}
						</a>
					</li>
				{/each}
			</ol>
		</nav>

		{#each policySections as section}
			<div class="mt-14">
				<h2
					id={section.id}
					class="scroll-mt-28 text-3xl font-semibold tracking-tight text-slate-950"
				>
					<span class="text-slate-500" aria-hidden="true">{section.number}.</span>
					{section.heading}
				</h2>

				{#if section.orderedItems}
					<dl class="mt-6 grid gap-3">
						{#each section.orderedItems as item}
							<div class="rounded-2xl border border-slate-200 bg-slate-50 p-5">
								<dt class="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">
									{item.term}
								</dt>
								<dd class="mt-2 break-all font-mono text-lg text-slate-900">{item.description}</dd>
							</div>
						{/each}
					</dl>
				{/if}

				{#each section.paragraphs as paragraph}
					<p class="mt-5 text-lg leading-8 text-slate-700">{paragraph}</p>
				{/each}

				{#if section.requirements}
					<!--
						Column widths are constrained rather than using a min-width plus a
						scroll container: a scrollable region needs a keyboard-focusable
						wrapper, and this table wraps cleanly at 320px without one.
					-->
					<table class="mt-6 w-full table-fixed border-collapse text-left">
						<caption class="sr-only">
							Accepted prefix origin validation methods for AS17290
						</caption>
						<thead>
							<tr class="border-b border-slate-300">
								<th scope="col" class="w-1/3 py-3 pr-4 align-top font-semibold text-slate-950"
									>Requirement</th
								>
								<th scope="col" class="py-3 align-top font-semibold text-slate-950">Description</th>
							</tr>
						</thead>
						<tbody>
							{#each section.requirements as requirement}
								<tr class="border-b border-slate-200 align-top">
									<th scope="row" class="py-4 pr-4 font-semibold text-slate-900"
										>{requirement.name}</th
									>
									<td class="py-4 leading-7 text-slate-700">{requirement.description}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}

				{#if section.bullets}
					<ul class="mt-6 space-y-3 pl-6 text-lg leading-8 text-slate-700 marker:text-orange-700">
						{#each section.bullets as bullet}
							<li class="list-disc pl-1">{bullet}</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/each}

		<div class="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6">
			<h2 class="text-2xl font-semibold tracking-tight">Requesting peering or transit</h2>
			<p class="mt-4 leading-7 text-slate-700">
				Send the requesting ASN, the AS-SET that documents it, the prefixes you intend to announce,
				and the validation method covering each one. Requests that already satisfy the criteria
				above are the fastest to process.
			</p>
			<p class="mt-4 leading-7 text-slate-700">
				Operational and routing contact:
				<a
					class="font-semibold text-orange-700 hover:text-orange-800"
					href={`mailto:${site.securityEmail}`}>{site.securityEmail}</a
				>. For commercial or consulting questions, use the
				<a class="font-semibold text-orange-700 hover:text-orange-800" href="/contact"
					>contact page</a
				>.
			</p>
			<p class="mt-4 leading-7 text-slate-700">
				The same routing and validation work is offered as a consulting engagement through
				<a
					class="font-semibold text-orange-700 hover:text-orange-800"
					href="/services/bgp-consulting">BGP consulting</a
				>
				and
				<a
					class="font-semibold text-orange-700 hover:text-orange-800"
					href="/services/ipv6-consulting">IPv6 consulting</a
				>. If you are new to public routing, the guide
				<a class="font-semibold text-orange-700 hover:text-orange-800" href="/resources/what-is-bgp"
					>What Is BGP and Why Does It Matter?</a
				> explains the concepts referenced above.
			</p>
			<ul class="mt-5 grid gap-2 leading-7 text-slate-700">
				{#each network.references as reference}
					<li>
						<a
							class="font-semibold text-orange-700 hover:text-orange-800"
							href={reference.href}
							target="_blank"
							rel="noopener noreferrer">{reference.label}</a
						>
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<section class="bg-slate-50 px-6 py-16 sm:px-8 lg:px-12">
	<div class="mx-auto max-w-4xl">
		<h2 class="text-2xl font-semibold tracking-tight text-slate-950">Signed policy document</h2>
		<p id="routing-document-help" class="mt-4 leading-7 text-slate-700">
			The text above is the authoritative policy. A PDF copy is provided for operators who need a
			document to attach to a peering request — you can
			<a
				class="font-semibold text-orange-700 hover:text-orange-800"
				href={network.policyPdf}
				target="_blank"
				rel="noopener noreferrer">open the routing policy PDF directly</a
			>.
		</p>
		<p class="mt-2 text-sm leading-7 text-slate-600">
			Policy maintained by {founder.name}, operator of {network.asn}.
		</p>
		<div class="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
			<iframe
				src={network.policyPdf}
				title="AS17290 BGP routing policy, PDF copy"
				aria-describedby="routing-document-help"
				class="h-screen w-full border-0"
				loading="lazy"
			></iframe>
		</div>
	</div>
</section>
