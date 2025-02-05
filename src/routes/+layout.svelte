<script lang="ts">
	import '../app.css';
	import Analytics from "$lib/components/analytics.svelte";
	let { children } = $props();

</script>

<Analytics />
<!--add a navbar-->
<nav class="bg-base-300 p-4">
	<div class="container mr-1 w-fit flex justify-between items-center">
	<img src="/logo.png" alt="H2 Technologies Logo" class="h-8 inline-block mr-4">
	<ul class="flex space-x-4 justify-self-end">
		<li><a href="/" class="hover:underline">Home</a></li>
		<li><a href="/about" class="hover:underline">About</a></li>
		<li><a href="/services" class="hover:underline">Services</a></li>
		<li><a href="/commitment" class="hover:underline">Commitment</a></li>
		<li><a href="/contact" class="hover:underline">Contact</a></li>
	</ul>
	</div>
</nav>

{@render children()}

<footer class="bg-base-300 fixed w-full bottom-0 text-center py-4 flex justify-center">
	<a href="/privacy" class="hover:underline px-8">Privacy Policy</a>
	<p>&copy; 2024 H2 Technologies. All rights reserved.</p>
	<a href="/commitment" class="hover:underline px-8">Commitment message</a>
</footer>