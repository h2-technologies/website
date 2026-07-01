<script lang="ts">
	import { site } from '$lib/site';

	export let title = 'Talk to an engineer about your next technology decision.';
	export let description =
		'Scheduled consulting starts with a practical conversation about goals, risks, budget, timeline, and the cleanest next step.';
	export let primaryLabel = 'Schedule a Free Consultation';
	export let secondaryLabel = 'Explore Services';
	export let secondaryHref = '/services/';
</script>

<section class="bg-slate-950 px-6 py-16 text-white sm:px-8 lg:px-12">
	<div
		class="mx-auto grid max-w-7xl gap-8 rounded-2xl border border-white/10 bg-white/5 p-8 text-left shadow-2xl shadow-slate-950/20 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center"
	>
		<div class="max-w-3xl">
			<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-300">Next step</p>
			<h2 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
			<p class="mt-4 text-lg leading-8 text-slate-300">{description}</p>
		</div>
		<div class="flex flex-col gap-3 sm:flex-row lg:flex-col">
			<a
				href={site.contactHref}
				class="inline-flex min-h-12 items-center justify-center rounded-lg bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-950/25 transition hover:-translate-y-0.5 hover:bg-orange-400"
			>
				{primaryLabel}
			</a>
			<a
				href={secondaryHref}
				class="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
			>
				{secondaryLabel}
			</a>
		</div>
	</div>
</section>
