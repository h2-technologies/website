<script lang="ts">
  import { page } from "$app/state";
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Button } from "flowbite-svelte";
	import { onMount } from "svelte";

  let activeUrl = $state(page.url.pathname);
  $effect(() => {
    activeUrl = page.url.pathname;
  })

  // svelte-ignore non_reactive_update
  let logo: string = $state("");
  // svelte-ignore non_reactive_update
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

<Navbar color="none" class="bg-white dark:bg-gray-900">
  <NavBrand href="/">
    <img src={logo} class={`w-${size}`} alt="H2 Technologies Logo" />
    {#if size < 20}
      <p class="text-white text-xl">Technologies</p>
    {/if}
  </NavBrand>
  <div class="flex md:order-2">
    <Button size="md" href="/login">Login</Button>
  </div>
  <NavHamburger />
  <NavUl>
    <NavLi class="text-xl" href="/about">About Us</NavLi>
    <NavLi class="text-xl" href="/store">Store</NavLi>
  </NavUl>
</Navbar>
