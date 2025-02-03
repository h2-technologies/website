<script lang="ts">
	import '../app.css';
	import Analytics from "$lib/components/analytics.svelte";
	let { children } = $props();

</script>

<Analytics />
<!--add a navbar-->
<nav class="bg-zinc-800 text-white p-4">
	<div class="container mr-1 w-fit flex justify-between items-center">
	<img src="/logo.png" alt="H2 Technologies Logo" class="h-8 inline-block mr-4">
	<ul class="flex space-x-4 justify-self-end">
	    <li><a href="/" class="hover:underline">Home</a></li>
	    <li><a href="/about" class="hover:underline">About</a></li>
	    <li><a href="/services" class="hover:underline">Services</a></li>
	    <li><a href="/contact" class="hover:underline">Contact</a></li>
	</ul>
	</div>
</nav>

{@render children()}

<footer class="bg-zinc-800 text-white fixed w-full bottom-0 text-center py-4">
	<p>&copy; 2024 H2 Technologies. All rights reserved.</p>
</footer>