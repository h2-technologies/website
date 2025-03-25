<script lang="ts">
	import { page } from '$app/state';
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
  let activeUrl = $state(page.url.pathname);
  $effect(() => {
    activeUrl = page.url.pathname;
  })
</script>

<Navbar class="bg-slate-800 shadow-lg" color="none">
  <NavBrand href="/" alt="H2 Technologies Logo" class=" inline-block mr-4">
    <img src="/whitelogo.png" alt="H2 Technologies Logo" class="h-16 inline-block" />
    <h1 class="text-2xl inline-flex align-middle text-neutral-300">Technologies</h1>
  </NavBrand>
  <NavHamburger />
  <NavUl {activeUrl}>
    <NavLi class="text-2xl font-nunito" href="/">Home</NavLi>
    <NavLi class="text-2xl font-nunito" href="/about">About</NavLi>
    <NavLi class="text-2xl font-nunito" href="/commitment">Services</NavLi>
    <NavLi class="text-2xl font-nunito" href="/contact">Contact</NavLi>
  </NavUl>

</Navbar>