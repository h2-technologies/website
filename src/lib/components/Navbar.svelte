<script>
  export let logo = '/whitelogo.png'; // Default logo path
  export let navLinks = [
    { text: 'Home', href: '/' },
    { text: 'Services', href: '/services' },
    { text: 'About', href: '/about' },
    { text: 'Contact', href: '/contact' },
  ];
  export let primaryButtonText = 'Get a Quote';
  export let primaryButtonLink = '/quote';
  export let secondaryButtonText = '';
  export let secondaryButtonLink = '';
</script>

<header class="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
  <div class="container mx-auto px-4 py-3 flex items-center justify-between">
    <div class="logo">
      <a href="/" class="flex items-center">
        <img src={logo} alt="Company Logo" class="h-8 mr-2" />
        <span class="font-bold text-xl text-gray-800 dark:text-white">H2 Technologies</span>
      </a>
    </div>

    <nav class="hidden md:block">
      <ul class="flex space-x-6">
        {#each navLinks as link}
          <li>
            <a href={link.href} class="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              {link.text}
            </a>
          </li>
        {/each}
      </ul>
    </nav>

    <div class="buttons flex gap-4">
      {#if primaryButtonText && primaryButtonLink}
        <a href={primaryButtonLink} class="primary-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-md transition-colors">
          {primaryButtonText}
        </a>
      {/if}
      {#if secondaryButtonText && secondaryButtonLink}
        <a href={secondaryButtonLink} class="secondary-button border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2.5 px-6 rounded-md transition-colors">
          {secondaryButtonText}
        </a>
      {/if}
    </div>

    <button id="mobile-menu-button" class="md:hidden text-gray-700 dark:text-gray-200 focus:outline-none" aria-label="Toggle Mobile Menu">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </button>
  </div>

  <div id="mobile-menu" class="hidden md:hidden bg-gray-100 dark:bg-gray-800">
    <div class="px-2 pt-2 pb-3 sm:px-3">
      {#each navLinks as link}
        <a href={link.href} class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
           >{link.text}</a>
      {/each}
    </div>
    {#if primaryButtonText && primaryButtonLink}
      <div class="px-4 py-3">
        <a href={primaryButtonLink} class="block w-full text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-md transition-colors">
          {primaryButtonText}
        </a>
      </div>
    {/if}
    {#if secondaryButtonText && secondaryButtonLink}
      <div class="px-4 py-3">
        <a href={secondaryButtonLink} class="block w-full text-center border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white font-bold py-2.5 px-6 rounded-md transition-colors">
          {secondaryButtonText}
        </a>
      </div>
    {/if}
  </div>
</header>

<style>
  /* Mobile menu styles (hidden by default, shown by JS) */
  #mobile-menu {
    display: none; /* Initially hidden */
  }
  .show {
    display: block;
  }
</style>