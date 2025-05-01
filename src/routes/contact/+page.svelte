<script>
	import { enhance } from "$app/forms";
	import Icon from "@iconify/svelte";
  import { useForm } from "svelte-use-form";
  const form = useForm();

  // Form data structure
  let contactFormData = $state({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

</script>

<svelte:head>
  <title>Contact Us | H2 Technologies</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
    Contact Us
  </h1>
  
  <p class="text-gray-600 dark:text-gray-400 mb-8 text-center">
    We'd love to hear from you! Please fill out the form below or use the contact
    information to get in touch.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div class="contact-form">
      <form use:enhance use:form method="POST" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Name</label
          >
          <input
            id="name"
            type="text"
            bind:value={contactFormData.name}
            required
            placeholder="Your Name"
            class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Email Address</label
          >
          <input
            id="email"
            type="email"
            bind:value={contactFormData.email}
            required
            placeholder="your.email@example.com"
            class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Subject</label
          >
          <input
            id="subject"
            type="text"
            bind:value={contactFormData.subject}
            placeholder="Subject of your inquiry"
            class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Message</label
          >
          <textarea
            id="message"
            bind:value={contactFormData.message}
            maxlength="400"
            required
            placeholder="Your message..."
            class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
          ></textarea>
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-300"
          >Send Message</button
        >
      </form>
    </div>

    <div class="contact-info">
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Our Contact Information
      </h2>
      <ul class="space-y-4">
        <li class="flex items-center gap-2">
          <Icon icon="material-symbols:phone-enabled" class="w-6 h-6 text-blue-500" />
          <span class="text-gray-700 dark:text-gray-300">567-261-0762</span>
        </li>
        <li class="flex items-center gap-2">
          <Icon icon="material-symbols:stacked-email" class="w-6 h-6 text-blue-500" />
          <span class="text-gray-700 dark:text-gray-300">info@h2tech.com</span>
        </li>
      </ul>

      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
        Connect With Us
      </h2>
      <div class="social-links flex gap-4">
        <a
          href="#"
          class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Facebook
        </a>
        <a
          href="#"
          class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Twitter
        </a>
        <a
          href="#"
          class="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          LinkedIn
        </a>
      </div>
    </div>
  </div>
</div>
