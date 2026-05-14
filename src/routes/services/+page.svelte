<script lang="ts">
	const offerings = [
		{
			id: 'development',
			tag: 'Build',
			title: 'Software and Website Development',
			description:
				'We design and build practical software and modern websites that fit how your business actually operates.',
			details: [
				'Custom business tools, internal portals, and web apps',
				'Refreshes for outdated websites and landing pages',
				'Implementation support focused on clarity, speed, and maintainability'
			],
			accent: 'from-orange-500/20 to-amber-400/20'
		},
		{
			id: 'google-workspace',
			tag: 'Collaborate',
			title: 'Google Workspace',
			description:
				'We help you set up, manage, and improve Google Workspace so your team stays connected and productive.',
			details: [
				'Workspace setup, licensing, and admin support',
				'Mail, drive, and calendar migration assistance',
				'User training and ongoing platform support'
			],
			accent: 'from-sky-500/20 to-cyan-400/20'
		},
		{
			id: 'fortinet',
			tag: 'Protect',
			title: 'Fortinet Equipment and Security Solutions',
			description:
				'We provide Fortinet hardware and implementation support to strengthen your network security posture.',
			details: [
				'Firewall and security hardware sales',
				'Guidance on deployment and configuration',
				'Security-first recommendations tailored to your environment'
			],
			accent: 'from-emerald-500/20 to-teal-400/20'
		}
	];

	const process = [
		'We start with a quick discovery conversation to understand your goal and current setup.',
		'We recommend the most practical path, with scope and priorities that match your budget and timeline.',
		'We implement the work and stay available for follow-up support when you need it.'
	];

	const faqs = [
		{
			question: 'Do you take on small projects?',
			answer:
				'Yes. We are comfortable handling focused work like a website refresh, a Workspace cleanup, or a security hardware upgrade.'
		},
		{
			question: 'Can you help us choose between options?',
			answer:
				'Yes. Part of the value we provide is helping you compare practical options and make a clear decision before work begins.'
		},
		{
			question: 'Do you support existing environments?',
			answer:
				'Yes. We can work within your current setup, improve what is already there, or help you plan a cleaner transition.'
		}
	];
</script>

<svelte:head>
	<title>Services | H2 Technologies</title>
	<meta
		name="description"
		content="Explore H2 Technologies services for software development, Google Workspace support, and Fortinet security solutions."
	/>
</svelte:head>

<section class="relative overflow-hidden bg-slate-950 text-white">
	<div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.2),transparent_30%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_28%)]"></div>
	<div class="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-24">
		<div class="mx-auto max-w-3xl text-center">
			<p class="inline-flex rounded-full border border-white/10 bg-white/6 px-4 py-1 text-sm font-medium tracking-[0.2em] text-orange-200 backdrop-blur">
				SERVICES
			</p>
			<h1 class="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
				Three core services, one practical technology partner.
			</h1>
			<p class="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
				Whether you need to build, improve collaboration, or strengthen security, we focus on solutions that fit the way your business already works.
			</p>
		</div>
	</div>
</section>

<section class="bg-slate-50 px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl space-y-6">
		{#each offerings as offering}
			<article id={offering.id} class="grid gap-0 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm lg:grid-cols-[0.95fr_1.05fr]">
				<div class={`bg-gradient-to-br ${offering.accent} p-8 sm:p-10`}>
					<div class="inline-flex rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white">
						{offering.tag}
					</div>
					<h2 class="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">{offering.title}</h2>
					<p class="mt-4 max-w-xl text-lg leading-8 text-slate-700">{offering.description}</p>
				</div>
				<div class="p-8 sm:p-10">
					<h3 class="text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">What this can include</h3>
					<div class="mt-5 space-y-3">
						{#each offering.details as detail}
							<div class="flex gap-3 rounded-2xl bg-slate-50 p-4">
								<span class="mt-1 h-2.5 w-2.5 rounded-full bg-orange-500"></span>
								<p class="text-sm leading-6 text-slate-700">{detail}</p>
							</div>
						{/each}
					</div>
				</div>
			</article>
		{/each}
	</div>
</section>

<section class="bg-white px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
		<div>
			<p class="text-sm font-semibold uppercase tracking-[0.25em] text-orange-600">How we work</p>
			<h2 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">A simple process that keeps things moving.</h2>
			<p class="mt-4 text-lg leading-8 text-slate-600">
				We keep projects focused on the decision, the implementation, and the follow-through so there is no confusion about next steps.
			</p>
		</div>
		<div class="grid gap-4">
			{#each process as step, index}
				<div class="flex gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
					<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
						0{index + 1}
					</div>
					<p class="pt-1 text-base leading-7 text-slate-700">{step}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="bg-slate-950 px-6 py-20 text-white sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl">
		<div class="max-w-3xl">
			<p class="text-sm font-semibold uppercase tracking-[0.25em] text-orange-300">FAQ</p>
			<h2 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">A few quick answers before you reach out.</h2>
		</div>

		<div class="mt-10 grid gap-4 lg:grid-cols-3">
			{#each faqs as faq}
				<div class="rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur">
					<h3 class="text-xl font-semibold">{faq.question}</h3>
					<p class="mt-3 text-sm leading-7 text-slate-300">{faq.answer}</p>
				</div>
			{/each}
		</div>

		<div class="mt-10 flex flex-col items-start justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-8 lg:flex-row lg:items-center">
			<div class="max-w-2xl">
				<h3 class="text-2xl font-semibold">Need help deciding where to start?</h3>
				<p class="mt-2 text-slate-300">Send us a message and we will help you map the first step.</p>
			</div>
			<a
				href="https://client-portal.app.intuit.com/contact-form?accountId=249325971&formId=287439"
				class="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-base font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-orange-100"
			>
				Contact H2 Technologies
			</a>
		</div>
	</div>
</section>