<script>
	import Icon from "@iconify/svelte";

  const clients = [
    { name: 'Bandit Machine', logo: '/clients/bandit-machine.png' }
  ];
</script>

<div class="text-gray-800 dark:text-white bg-white dark:bg-gray-800 py-3 px-4">
  <h1 class="text-3xl font-semibold pb-2">
    Who We Are
  </h1>
  <p class="text-xl">
    H2 Technologies is a technology solutions provider founded in 2023, headquarted in Ashland, OH.
    Our team comprises experienced professionals with deep expertise in software development, cloud solutions, and cybersecurity.
    We are committed to delivering high-quality, innovative solutions that meet the unique needs of our clients.
  </p>

</div>

<div class="text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-900 py-3 px-4">
  <h1 class="text-3xl font-semibold pb-2">
    Mission
  </h1>
  <p class="text-xl">
    To empower businesses of all sizes with innovative technology solutions that drive growth, efficiency, and security.
  </p>
</div>

<div class="text-gray-800 dark:text-white bg-white dark:bg-gray-800 py-3 px-4">
  <h2 class="text-3xl font-semibold pb-2">
    Vision
  </h2>
  <p class="text-xl">
    To be a leading technology partner, recognized for our expertise, innovation, integrity, and commitment to customer success.
  </p>
</div>

<div class="text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-900 py-3 px-4">
  <h2 class="text-3xl font-semibold pb-2">
    Values
  </h2>
  <ul class="list-disc list-inside text-xl">
    <li><strong>Innovation:</strong> We embrace change and continuously seek new ways to solve problems.</li>
    <li><strong>Customer-Centricity:</strong> Our customers are at the heart of everything we do.</li>
    <li><strong>Integrity:</strong> We conduct our business with honesty and transparency.</li>
    <li><strong>Collaboration:</strong> We believe in the power of teamwork and open communication.</li>
    <li><strong>Excellence:</strong> We strive for the highest standards in all our services and solutions.</li>
  </ul>
</div>

<!--TODO: Make these cards function a little better-->
<div class="text-gray-800 dark:text-white bg-white dark:bg-gray-800 py-2 lg:px-4 md:pr-7 md:pl-4">
  <h2 class="text-3xl font-semibold py-2">
    What We Do
  </h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
    <div class="bg-gray-100 dark:bg-gray-900 h-52 w-72 rounded-xl">
      <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2 pt-4">
        Software and Website Development
      </h3>
      <p class="text-gray-600 dark:text-gray-300">
        We create custom software solutions and websites tailored to your business needs.
      </p>
    </div>
    <div class="bg-gray-100 dark:bg-gray-900 h-52 w-72 rounded-xl">
      <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2 pt-4">
        Google Workspace Solutions
      </h3>
      <p class="text-gray-600 dark:text-gray-300">
        We provide tailored Google Workspace solutions to enhance your business's productivity and collaboration.
      </p>
    </div>
    <div class="bg-gray-100 dark:bg-gray-900 h-52 w-72 rounded-xl">
      <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2 pt-4">
        Fortinet Equipment and Security Solutions
      </h3>
      <p class="text-gray-600 dark:text-gray-300">
        We provide Fortinet equipment and security solutions to protect your business from cyber threats while powering day to day operations.
      </p>
    </div>
  </div>
</div>

<div class="text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-900 py-2 px-4">
  <h2 class="text-3xl font-semibold text-gray-800 dark:text-white text-center">
    Our Clients
  </h2>
  <div class="flex flex-wrap justify-center gap-8">
    {#each clients as client}
      <div class="client-logo">
        <img
          src={client.logo}
          alt={client.name}
          class="h-16"
        />
      </div>
    {/each}
  </div>
</div>

<section class="contact-information py-16">
  <div class="container mx-auto text-center">
    <h2 class="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
      Get in Touch
    </h2>
    <p class="text-gray-600 dark:text-gray-300 mb-8">
      We'd love to hear from you. Contact us today to learn more about how we
      can help your business.
    </p>
    <a
      href="/contact"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition-colors duration-300"
    >
      Contact Us
    </a>
  </div>
</section>
