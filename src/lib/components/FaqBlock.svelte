<script lang="ts">
	export let faqs: { question: string; answer: string }[] = [];
</script>

<div class="grid gap-4">
	{#each faqs as faq}
		<details class="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm">
			<summary class="cursor-pointer text-lg font-semibold text-slate-950">{faq.question}</summary>
			<p class="mt-3 leading-7 text-slate-600">{faq.answer}</p>
		</details>
	{/each}
</div>
