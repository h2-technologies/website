<script lang="ts">
	import '../app.css';
	import Analytics from "$lib/components/analytics.svelte";
	import Navbar from '$lib/components/Navbar.svelte';
	let { children } = $props();

</script>

<div class="bg-slate-300 h-screen w-screen min-w-fit">
	<Analytics />

	<div>
		<Navbar />
	</div>

	<main class="font-roboto flex-col items-center justify-center text-center text-slate-800">
		{@render children()}
	</main>

	<footer class="fixed w-full bottom-0 text-center py-4 flex justify-center bg-base-300">
		<a href="/privacy" class="hover:underline px-8">Privacy Policy</a>
		<p>&copy; {new Date().getFullYear()} H2 Technologies. All rights reserved.</p>
		<a href="/commitment" class="hover:underline px-8">Commitment message</a>
	</footer>
</div>
