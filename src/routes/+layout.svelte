<script lang="ts">
	import '../app.css';
	import Analytics from "$lib/components/analytics.svelte";
	import Navbar from '$lib/components/Navbar.svelte';
	let { children } = $props();

</script>

<div class="h-screen w-full min-w-fit overflow-x-hidden">
	<Analytics />
	<div>
		<Navbar />
	</div>

	<main class="font-roboto flex-col items-center justify-center text-center text-slate-800">
		{@render children()}
	</main>

	<footer class="w-full bottom-0 text-start p-4 justify-center bg-slate-800 text-slate-100 text-md">
		<p>&copy;{new Date().getFullYear()} H2 Technologies. All rights reserved.</p>
	</footer>
</div>
