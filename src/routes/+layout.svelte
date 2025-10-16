<script lang="ts">
	import '../app.css';
	import Analytics from "$lib/components/analytics.svelte";
	import Navbar from '$lib/components/Navbar.svelte';
	let { children } = $props();

</script>

<div class="min-h-screen h-fit w-full min-w-fit overflow-x-hidden">
	<Analytics />
	<div>
		<Navbar />
	</div>

	<main class="font-roboto flex-col items-center justify-center text-center text-slate-800 mb-auto grow">
		{@render children()}
	</main>

	<footer class="w-full bottom-0 text-start p-4 justify-center dark:bg-gray-900 text-slate-100 text-md pt-2 sticky top-full">
		<p>&copy;{new Date().getFullYear()} H2 Technologies. All rights reserved.</p>
	</footer>
</div>
