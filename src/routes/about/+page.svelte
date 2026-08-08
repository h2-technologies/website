<script>
	import CTA from '$lib/components/CTA.svelte';
	import Seo from '$lib/components/Seo.svelte';

	const clients = [{ name: 'Bandit Machine', logo: '/clients/bandit-machine.png' }];

	const values = [
		{
			title: 'Innovation',
			description:
				'We embrace necessary change and relentlessly seek novel approaches to solve complex problems.'
		},
		{
			title: 'Customer Centricity',
			description: 'We put our customers at the heart of everything we do.'
		},
		{
			title: 'Integrity',
			description: 'We conduct our business with honesty and transparency.'
		},
		{
			title: 'Collaboration',
			description: 'We believe in the power of teamwork and open communication.'
		},
		{
			title: 'Excellence',
			description: 'We strive for the highest standards in all our services and solutions.'
		},
		{
			title: 'Adaptability',
			description: 'We embrace change and continuously seek new ways to solve problems.'
		}
	];

	const services = [
		{
			title: 'Software and Website Development',
			description:
				'We create custom software solutions and websites tailored to your business needs.'
		},
		{
			title: 'Google Workspace Solutions',
			description:
				'We provide tailored Google Workspace solutions to enhance your business productivity and collaboration.'
		},
		{
			title: 'Fortinet Equipment and Security Solutions',
			description:
				'We provide Fortinet equipment and security solutions to protect your business from cyber threats while powering day-to-day operations.'
		}
	];
</script>

<Seo
	title="About H2 Technologies LLC | Ohio Technology Consulting"
	description="Meet H2 Technologies LLC, an Ohio technology consulting firm focused on secure software, websites, networks, cybersecurity, cloud, and business IT."
	path="/about"
/>

<div class="bg-white text-gray-900">
	<section class="relative w-full overflow-hidden border-b border-gray-200">
		<div
			class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_34%),radial-gradient(circle_at_top_right,rgba(251,146,60,0.22),transparent_28%)]"
		></div>
		<div class="relative mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:px-10">
			<div class="mx-auto max-w-3xl text-center">
				<p
					class="mb-4 inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-1 text-sm font-medium tracking-wide text-orange-700 shadow-sm"
				>
					About H2 Technologies
				</p>
				<h1 class="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
					Technology partners for teams that need clarity, speed, and security.
				</h1>
				<p class="mt-6 max-w-2xl mx-auto text-lg leading-8 text-gray-600 sm:text-xl">
					H2 Technologies is a technology solutions provider founded in 2023 and based in Ashland,
					OH. We bring together software development, cloud solutions, and cybersecurity to deliver
					practical work that helps organizations move forward with confidence.
				</p>
			</div>
		</div>
	</section>

	<section class="mx-auto grid max-w-6xl gap-6 px-6 py-16 sm:px-8 lg:grid-cols-2 lg:px-10">
		<article class="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
			<p class="text-sm font-semibold uppercase tracking-[0.25em] text-orange-700">Mission</p>
			<h2 class="mt-4 text-3xl font-semibold tracking-tight text-gray-900">What guides our work</h2>
			<p class="mt-4 text-lg leading-8 text-gray-600">
				Our mission is to empower small and midsize businesses with reliable, scalable software and
				hardware solutions that remove barriers, accelerate growth, and unlock their full potential.
			</p>
		</article>

		<article class="rounded-3xl border border-gray-200 bg-gray-50 p-8 shadow-sm">
			<p class="text-sm font-semibold uppercase tracking-[0.25em] text-orange-700">Vision</p>
			<h2 class="mt-4 text-3xl font-semibold tracking-tight text-gray-900">
				What we are building toward
			</h2>
			<p class="mt-4 text-lg leading-8 text-gray-700">
				Our vision is to create a company that clients are proud to partner with, and employees are
				proud to call home. We aim to be a trusted technology partner known for delivering
				thoughtful, responsive, and practical solutions that drive real results for our clients.
			</p>
		</article>
	</section>

	<section class="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-10">
		<div class="mx-auto max-w-2xl text-center">
			<p class="text-sm font-semibold uppercase tracking-[0.25em] text-orange-700">Values</p>
			<h2 class="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
				The principles behind every engagement
			</h2>
		</div>

		<div class="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
			{#each values as value}
				<div
					class="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
				>
					<div class="mb-4 h-1.5 w-16 rounded-full bg-linear-to-r from-orange-500 to-sky-500"></div>
					<h3 class="text-xl font-semibold text-gray-900">{value.title}</h3>
					<p class="mt-3 text-base leading-7 text-gray-600">{value.description}</p>
				</div>
			{/each}
		</div>
	</section>

	<section class="mx-auto max-w-6xl px-6 py-16 sm:px-8 lg:px-10">
		<div class="rounded-4xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
			<div class="mx-auto max-w-2xl text-center">
				<p class="text-sm font-semibold uppercase tracking-[0.25em] text-orange-700">What We Do</p>
				<h2 class="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
					Services shaped around practical outcomes
				</h2>
				<p class="mt-4 text-lg leading-8 text-gray-600">
					We focus on building and supporting systems that are dependable, understandable, and
					tailored to how your team actually works.
				</p>
			</div>

			<div class="mt-8 grid gap-5 lg:grid-cols-3">
				{#each services as service}
					<div class="rounded-2xl border border-gray-200 bg-gray-50 p-6">
						<h3 class="text-xl font-semibold text-gray-900">{service.title}</h3>
						<p class="mt-3 text-base leading-7 text-gray-600">{service.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:px-10">
		<div class="rounded-4xl border border-gray-200 bg-gray-50 px-8 py-10 shadow-sm sm:px-10">
			<div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
				<div class="max-w-2xl">
					<p class="text-sm font-semibold uppercase tracking-[0.25em] text-orange-700">
						Our Clients
					</p>
					<h2 class="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
						Trusted by teams that need reliable execution
					</h2>
					<p class="mt-4 text-lg leading-8 text-gray-700">
						We build long-term partnerships by delivering work that is thoughtful, responsive, and
						grounded in the realities of day-to-day operations.
					</p>
				</div>

				<div class="flex flex-wrap gap-4">
					{#each clients as client}
						<div class="flex items-center rounded-2xl bg-white border border-gray-200 px-5 py-4">
							<img
								src={client.logo}
								alt={client.name}
								class="h-12 w-auto"
								width="2038"
								height="500"
								loading="lazy"
								decoding="async"
							/>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<CTA
		title="Let's talk about what your team needs next."
		description="If you are looking for software support, a website refresh, cybersecurity guidance, or help with collaboration tooling, H2 Technologies can help map the next step."
		primaryLabel="Schedule a Free Consultation"
	/>
</div>
