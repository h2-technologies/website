<script lang="ts">
	import { page } from '$app/state';
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
  let activeUrl = $state(page.url.pathname);
  $effect(() => {
    activeUrl = page.url.pathname;
  })
</script>

<Navbar class="bg-base-300" color="none">
  <NavBrand href="/" alt="H2 Technologies Logo" class="h-8 inline-block mr-4">
    <img src="/logo.png" alt="H2 Technologies Logo" class="h-8 inline-block mr-4" />
  </NavBrand>
  <NavHamburger />
  <NavUl {activeUrl}>
    <NavLi class="text-lg font-roboto" href="/">Home</NavLi>
    <NavLi class="text-lg font-roboto" href="/about">About</NavLi>
    <NavLi class="text-lg font-roboto" href="/commitment">Commitment</NavLi>
  </NavUl>

</Navbar>