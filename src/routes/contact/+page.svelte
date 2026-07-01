<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { services } from '$lib/services';
	import { site } from '$lib/site';
</script>

<Seo
	title="Contact H2 Technologies LLC | Talk to an Engineer"
	description="Contact H2 Technologies to schedule a free consultation or request a technology assessment for software, IT consulting, cybersecurity, networking, infrastructure, Google Workspace, or Fortinet work."
	path="/contact/"
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
		</div>

		<form
			class="grid gap-4 rounded-2xl border border-white/10 bg-white p-6 text-left text-slate-900 shadow-2xl sm:p-8"
			action={site.contactHref}
			method="get"
		>
			<div class="grid gap-4 sm:grid-cols-2">
				<label class="grid gap-2 font-semibold">
					Name
					<input
						class="rounded-lg border border-slate-300 px-4 py-3"
						name="name"
						autocomplete="name"
						required
					/>
				</label>
				<label class="grid gap-2 font-semibold">
					Company
					<input
						class="rounded-lg border border-slate-300 px-4 py-3"
						name="company"
						autocomplete="organization"
					/>
				</label>
				<label class="grid gap-2 font-semibold">
					Email
					<input
						class="rounded-lg border border-slate-300 px-4 py-3"
						name="email"
						type="email"
						autocomplete="email"
						required
					/>
				</label>
				<label class="grid gap-2 font-semibold">
					Phone
					<input
						class="rounded-lg border border-slate-300 px-4 py-3"
						name="phone"
						type="tel"
						autocomplete="tel"
					/>
				</label>
				<label class="grid gap-2 font-semibold">
					Service Needed
					<select class="rounded-lg border border-slate-300 px-4 py-3" name="service">
						<option value="">Select a service</option>
						{#each services as service}
							<option>{service.title}</option>
						{/each}
					</select>
				</label>
				<label class="grid gap-2 font-semibold">
					Timeline
					<select class="rounded-lg border border-slate-300 px-4 py-3" name="timeline">
						<option>Not sure yet</option>
						<option>As soon as possible</option>
						<option>Within 30 days</option>
						<option>1-3 months</option>
						<option>3+ months</option>
					</select>
				</label>
				<label class="grid gap-2 font-semibold sm:col-span-2">
					Budget Range
					<select class="rounded-lg border border-slate-300 px-4 py-3" name="budget">
						<option>Not sure yet</option>
						<option>Under $5,000</option>
						<option>$5,000-$15,000</option>
						<option>$15,000-$50,000</option>
						<option>$50,000+</option>
					</select>
				</label>
			</div>
			<label class="grid gap-2 font-semibold">
				Project Details
				<textarea
					class="min-h-36 rounded-lg border border-slate-300 px-4 py-3"
					name="details"
					required
				></textarea>
			</label>
			<button
				class="min-h-12 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600"
				type="submit"
			>
				Request a Technology Assessment
			</button>
			<p class="text-sm leading-6 text-slate-600">
				This form forwards you to H2 Technologies' hosted contact workflow. Include enough detail to
				help route the request quickly.
			</p>
		</form>
	</div>
</section>
