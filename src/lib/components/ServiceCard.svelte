<script lang="ts">
	import type { Service } from '$lib/services';

	export let service: Service;
</script>

<article
	class="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
>
	<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-700">Service</p>
	<h3 class="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{service.title}</h3>
	<p class="mt-3 leading-7 text-slate-600">{service.meta}</p>
	<a
		href={`/services/${service.slug}`}
		class="mt-auto inline-flex pt-6 text-sm font-semibold text-orange-700 transition group-hover:text-orange-800"
	>
		Learn about {service.title}
		<span aria-hidden="true" class="ml-2">→</span>
	</a>
</article>
