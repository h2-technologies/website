<script lang="ts">
	import '../app.css';
	import Analytics from "$lib/components/analytics.svelte";
	let { children } = $props();

</script>

<Analytics />

{@render children()}

<footer class="bg-zinc-800 text-white fixed w-full bottom-0 text-center py-4">
	<p>&copy; 2024 H2 Technologies. All rights reserved.</p>
</footer>