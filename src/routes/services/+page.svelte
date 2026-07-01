<script lang="ts">
	import CTA from '$lib/components/CTA.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ServiceCard from '$lib/components/ServiceCard.svelte';
	import { services } from '$lib/services';

	const groups = [
		{
			title: 'Software, Websites, and Automation',
			slugs: ['custom-software-development', 'business-website-development', 'business-automation']
		},
		{
			title: 'Networks, Routing, and Infrastructure',
			slugs: [
				'enterprise-network-design',
				'bgp-consulting',
				'ipv6-consulting',
				'cloud-infrastructure-consulting',
				'network-monitoring'
			]
		},
		{
			title: 'Security, Productivity, and Support',
			slugs: [
				'fortinet-firewall-consulting',
				'google-workspace-administration',
				'microsoft-365-migration',
				'cybersecurity-consulting',
				'vpn-remote-access-solutions',
				'disaster-recovery-planning',
				'managed-it-support'
			]
		}
	];
</script>

<Seo
	title="Technology Consulting Services | H2 Technologies LLC"
	description="Explore H2 Technologies services for software development, business websites, enterprise network design, BGP, IPv6, Fortinet, Google Workspace, cybersecurity, cloud infrastructure, and managed IT support."
	path="/services/"
/>

<section class="bg-slate-950 px-6 py-20 text-white sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl">
		<div class="max-w-4xl">
			<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">Services</p>
			<h1 class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
				Technology services for secure systems, reliable networks, and practical business
				operations.
			</h1>
			<p class="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
				H2 Technologies supports focused projects and broader technology roadmaps across software,
				websites, networking, cybersecurity, collaboration platforms, infrastructure, and managed
				support.
			</p>
		</div>
	</div>
</section>

<section class="bg-slate-50 px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl space-y-14">
		{#each groups as group}
			<div>
				<h2 class="text-3xl font-semibold tracking-tight">{group.title}</h2>
				<div class="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
					{#each group.slugs.map((slug) => services.find((service) => service.slug === slug)!) as service}
						<ServiceCard {service} />
					{/each}
				</div>
			</div>
		{/each}
	</div>
</section>

<CTA
	title="Need help deciding which service fits?"
	description="Talk to an engineer about your current environment, business goal, timeline, and the cleanest path forward."
	primaryLabel="Talk to an Engineer"
/>
