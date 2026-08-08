<script lang="ts">
	export let items: { name: string; href: string }[] = [];
</script>

<nav aria-label="Breadcrumb" class="mb-6 text-sm text-slate-300">
	<ol class="flex flex-wrap items-center gap-2">
		{#each items as item, index}
			<li>
				{#if index < items.length - 1}
					<a class="font-medium text-orange-300 hover:text-orange-200" href={item.href}
						>{item.name}</a
					>
					<span class="ml-2" aria-hidden="true">/</span>
				{:else}
					<span aria-current="page">{item.name}</span>
				{/if}
			</li>
		{/each}
	</ol>
</nav>
