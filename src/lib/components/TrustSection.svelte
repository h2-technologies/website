<script lang="ts">
	import { expertise, industries } from '$lib/site';
</script>

<section class="bg-white px-6 py-20 text-slate-900 sm:px-8 lg:px-12">
	<div class="mx-auto max-w-7xl">
		<div class="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
			<div>
				<p class="text-sm font-semibold uppercase tracking-[0.22em] text-orange-700">
					Why H2 Technologies
				</p>
				<h2 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
					Technical depth with practical business judgment.
				</h2>
				<p class="mt-4 text-lg leading-8 text-slate-600">
					H2 Technologies connects software, networks, security, cloud services, and day-to-day IT
					support so decisions are not made in silos.
				</p>
			</div>
			<div class="grid gap-4 sm:grid-cols-2">
				<div class="rounded-2xl border border-slate-200 bg-slate-50 p-6">
					<h3 class="text-xl font-semibold">Technical Expertise</h3>
					<ul class="mt-4 space-y-3 text-left text-slate-700">
						{#each expertise as item}
							<li class="flex gap-3">
								<span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-orange-700"></span>
								<span>{item}</span>
							</li>
						{/each}
					</ul>
				</div>
				<div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
					<h3 class="text-xl font-semibold">Industries Served</h3>
					<ul class="mt-4 space-y-3 text-left text-slate-700">
						{#each industries as item}
							<li class="flex gap-3">
								<span class="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-600"></span>
								<span>{item}</span>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</div>
</section>
