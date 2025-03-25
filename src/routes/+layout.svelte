<script lang="ts">
	import '../app.css';
	import Analytics from "$lib/components/analytics.svelte";
	import Navbar from '$lib/components/Navbar.svelte';
	let { children } = $props();

</script>

<div class="bg-slate-300 h-fit w-screen min-w-fit">
	<Analytics />
	<div>
		<Navbar />
	</div>

	<main class="font-roboto flex-col items-center justify-center text-center text-slate-800">
		{@render children()}
	</main>

	<footer class="fixed w-full bottom-0 text-start p-4 justify-center bg-slate-800 text-slate-100 text-md">
		<a href="/privacy" class="hover:underline ">Privacy Policy</a>
		<p>&copy;{new Date().getFullYear()} H2 Technologies. All rights reserved.</p>
	</footer>
</div>
