<script lang="ts">
  import { page } from "$app/state";
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button } from "flowbite-svelte";
	import { onMount } from "svelte";

  let activeUrl = $derived(page.url.pathname);

  let logo: string = $state("");
  let size: number = $state(0);

  onMount(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      logo = '/squareLogo.png';
      size = 14;
    } else {
      logo = '/wideLogo.png';
      size = 48;
    }
  })
</script>

<Navbar color="none" class="sticky start-0 top-0 z-20 w-full bg-white dark:bg-gray-900">
  <NavBrand href="/">
    <img src={logo} class={`w-${size}`} alt="H2 Technologies Logo" />
    {#if size < 20}
      <p class="text-white text-xl">Technologies</p>
    {/if}
  </NavBrand>
  <div class="flex md:order-2 pl-20">
    <Button size="md" href="/login">Login</Button>
  </div>
  <NavHamburger />
  <NavUl {activeUrl}>
    <NavLi class="text-xl" href="/about">About Us</NavLi>
    <NavLi class="text-xl" href="/store">Store</NavLi>
  </NavUl>
</Navbar>
