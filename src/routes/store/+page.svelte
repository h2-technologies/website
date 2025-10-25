<script lang="ts">
	import Icon from "@iconify/svelte";
</script>

<svelte:head>
  <title>Store - Coming Soon | H2 Technologies</title>
</svelte:head>

<section class="min-h-[80vh] flex items-center justify-center bg-gray-100 dark:bg-gray-800 h-screen">
  <div class="container mx-auto px-4 py-16">
    <div class="max-w-3xl mx-auto text-center">
      <!-- Icon -->
      <div class="mb-8 flex justify-center">
        <div class="relative">
          <Icon 
            icon="mdi:storefront-outline" 
            class="w-24 h-24 text-orange-500 animate-pulse"
          />
          <div class="absolute inset-0 bg-orange-500 opacity-20 blur-2xl rounded-full"></div>
        </div>
      </div>

      <!-- Main Heading -->
      <h1 class="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-800 dark:text-white mb-6">
        Coming Soon
      </h1>

      <!-- Subheading -->
      <p class="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8">
        Our online store is under construction
      </p>

      <!-- Description -->
      <p class="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
        We're working hard to bring you an amazing shopping experience. Stay tuned for exclusive products and services tailored to your technology needs.
      </p>

      <!-- Call to Action Buttons -->
      <div class="flex flex-wrap justify-center gap-4 mb-12 pt-8">
        <a
          href="/contact"
          class="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-md transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <span class="flex items-center gap-2">
            <Icon icon="mdi:email-outline" class="w-5 h-5" />
            Contact Us
          </span>
        </a>
        <a
          href="/"
          class="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-bold py-3 px-8 rounded-md transition-all transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-300 dark:border-gray-600"
        >
          <span class="flex items-center gap-2">
            <Icon icon="mdi:home-outline" class="w-5 h-5" />
            Back to Home
          </span>
        </a>
      </div>
    </div>
  </div>
</section>
