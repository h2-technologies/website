<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button } from 'flowbite-svelte';
</script>

<svelte:head>
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-418QESNPEX">
	</script>
	<script>
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());
		gtag('config', 'G-418QESNPEX');
	</script>
</svelte:head>

<div class="h-fit min-h-screen w-full min-w-fit overflow-x-hidden">
	<div>
		<Navbar>
			<NavBrand href="/">
				<img src="/wideLogo.png" class="w-50" alt="H2 Technologies Logo" />
			</NavBrand>
			<div class="flex md:order-2">
				<Button
					size="md"
					href="https://client-portal.app.intuit.com/contact-form?accountId=249325971&formId=287439"
					class="bg-orange-500">Contact Us</Button
				>
				<NavHamburger />
			</div>
			<NavUl class="order-1">
				<NavLi class="text-xl" href="/about">About Us</NavLi>
			</NavUl>
		</Navbar>
	</div>

	<main
		class="w-full font-roboto mb-auto grow flex flex-col justify-center text-center text-slate-800"
	>
		{@render children()}
	</main>

	<footer
		class="text-md sticky top-full bottom-0 w-full justify-center p-4 pt-2 text-start text-slate-100 dark:bg-gray-900"
	>
		<p>&copy;{new Date().getFullYear()} H2 Technologies. All rights reserved.</p>
	</footer>
</div>
