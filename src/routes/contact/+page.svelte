<script lang="ts">
	import ContactDetails from '$lib/components/ContactDetails.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { absoluteUrl, nap, site } from '$lib/site';

	const path = '/contact';
	const contactPageSchema = {
		'@type': 'ContactPage',
		'@id': `${absoluteUrl(path)}#webpage`,
		url: absoluteUrl(path),
		name: 'Contact H2 Technologies LLC',
		description:
			'Reach H2 Technologies in Ashland, Ohio for a technology assessment covering software, network, security, and IT support work.',
		isPartOf: { '@id': `${site.url}/#website` },
		about: { '@id': `${site.url}/#organization` },
		mainEntity: { '@id': `${site.url}/#organization` }
	};
	const contactPointSchema = {
		'@type': 'ContactPoint',
		'@id': `${absoluteUrl(path)}#sales`,
		contactType: 'sales',
		areaServed: site.areaServed,
		availableLanguage: 'English',
		url: site.contactHref,
		...(nap.telephone ? { telephone: nap.telephone } : {}),
		...(nap.email ? { email: nap.email } : {})
	};
	const breadcrumbSchema = {
		'@type': 'BreadcrumbList',
		itemListElement: [
			{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
			{ '@type': 'ListItem', position: 2, name: 'Contact', item: absoluteUrl(path) }
		]
	};
</script>

<Seo
	title="Contact H2 Technologies LLC | Talk to an Engineer"
	description="Contact H2 Technologies in Ashland, Ohio for a technology assessment covering software, cybersecurity, networking, Google Workspace, Fortinet, or IT support."
	{path}
	schema={[contactPageSchema, contactPointSchema, breadcrumbSchema]}
/>

<section class="bg-slate-950 px-6 py-20 text-white sm:px-8 lg:px-12">
	<div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
		<div>
			<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">Contact</p>
			<h1 class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
				Talk to an engineer.
			</h1>
			<p class="mt-6 text-lg leading-8 text-slate-300">
				Share what you are trying to improve. H2 Technologies will review the request and follow up
				with a practical next step for consultation, assessment, or project scoping.
			</p>
			<div class="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
				<h2 class="text-xl font-semibold">What happens after submission</h2>
				<p class="mt-3 leading-7 text-slate-300">
					Expect a response focused on clarifying the business goal, current environment, timeline,
					budget range, and whether a discovery call or technology assessment is the right next
					step.
				</p>
				<a class="mt-5 inline-flex font-semibold text-orange-300" href={site.contactHref}
					>Use the hosted contact form instead →</a
				>
			</div>

			<div class="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
				<h2 class="text-xl font-semibold">Business details</h2>
				<div class="mt-3">
					<ContactDetails />
				</div>
				<p class="mt-4 text-sm leading-7 text-slate-400">
					H2 Technologies is based in Ashland, Ohio and delivers most consulting work remotely, with
					onsite coordination arranged for network, firewall, and cabling work across
					<a class="font-semibold text-orange-300 hover:text-orange-200" href="/locations"
						>the Ohio areas we serve</a
					>.
				</p>
			</div>
		</div>

		<section
			aria-labelledby="hosted-contact-heading"
			class="rounded-2xl border border-white/10 bg-white p-6 text-left text-slate-900 shadow-2xl sm:p-8"
		>
			<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-700">
				Secure contact workflow
			</p>
			<h2 id="hosted-contact-heading" class="mt-3 text-3xl font-semibold tracking-tight">
				Request a technology assessment
			</h2>
			<p class="mt-4 leading-7 text-slate-600">
				Open H2 Technologies' Intuit-hosted contact form to share your name, contact information,
				service need, timeline, and project details directly with the team.
			</p>
			<ul class="mt-6 grid gap-3 text-slate-700">
				<li class="flex gap-3">
					<span aria-hidden="true" class="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-700"></span>
					Describe the business goal and current environment.
				</li>
				<li class="flex gap-3">
					<span aria-hidden="true" class="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-700"></span>
					Include timing, budget range, and known constraints when possible.
				</li>
				<li class="flex gap-3">
					<span aria-hidden="true" class="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-700"></span>
					H2 Technologies will follow up with the most practical next step.
				</li>
			</ul>
			<a
				href={site.contactHref}
				class="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-orange-700 px-6 py-3 text-center font-semibold text-white transition hover:bg-orange-800"
			>
				Open the Hosted Contact Form
			</a>
			<p class="mt-4 text-sm leading-6 text-slate-600">
				Your information is entered in the hosted workflow rather than placed in this website's URL.
			</p>
		</section>
	</div>
</section>
