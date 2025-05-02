<script>
	import Icon from "@iconify/svelte";

  // Dummy data for team members (replace with your actual data)
  const teamMembers = [
    {
      name: 'Austin Hadley',
      title: 'CEO',
      photo: '', // Replace with your actual image path
    },
    {
      name: 'Samuel Valencia',
      title: 'COO',
      photo: '', // Replace with your actual image path
    },
    {
      name: 'Eric Doepke',
      title: 'Junior Developer',
      photo: '', // Replace with your actual image path
    },
    {
      name: 'Joshua Lambert',
      title: 'Junior Designer',
      photo: '',
    },
    {
      name: 'Skyla Crislip',
      title: 'Junior Sales Associate',
      photo: '',
    },
  ];

  // Dummy data for clients
  const clients = [
    { name: 'Bandit Machine', logo: '/clients/bandit-machine.png' }
  ];
</script>

<main class="about-us-page">
  <header class="bg-gray-100 dark:bg-gray-900 py-16 text-center">
    <div class="container mx-auto">
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white">
        About Us
      </h1>
    </div>
  </header>

  <section class="company-overview py-16">
    <div class="container mx-auto space-y-8">
      <h2 class="text-3xl font-semibold text-gray-800 dark:text-white">
        Company Overview
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Our Mission
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            Our mission is to empower businesses with innovative technology
            solutions that drive growth, efficiency, and security.
          </p>
          <h3 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mt-6">
            Our Vision
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            To be a leading technology partner, recognized for our expertise,
            innovation, and commitment to client success.
          </p>
          <h3 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 mt-6">
            Our Values
          </h3>
          <ul class="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
            <li>Excellence</li>
            <li>Integrity</li>
            <li>Collaboration</li>
            <li>Innovation</li>
            <li>Customer Satisfaction</li>
          </ul>
        </div>
        <div>
          <h3 class="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Who We Are
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            H2 Technologies LLC is a technology solutions provider founded in 2023
            and headquartered in Ashland, OH. We have a rich history of
            helping businesses across various industries transform their
            operations with cutting-edge technology. Our team comprises
            experienced professionals with deep expertise in software
            development, cloud solutions, and cybersecurity.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section class="what-we-do py-16 bg-gray-100 dark:bg-gray-900">
    <div class="container mx-auto space-y-8">
      <h2 class="text-3xl font-semibold text-gray-800 dark:text-white text-center">
        What We Do
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Software and Website Development
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            We create custom software solutions and websites tailored to your
            business needs.
          </p>
        </div>
        <div>
          <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Google Workspace Solutions
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            We provide comprehensive Google Workspace solutions to enhance
            productivity and collaboration.
          </p>
        </div>
        <div>
          <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Fortinet Equipment and Security Solutions
          </h3>
          <p class="text-gray-600 dark:text-gray-300">
            We offer Fortinet's industry-leading security products to protect
            your business from cyber threats.
          </p>
        </div>
      </div>
      <div>
        <h3 class="text-2xl font-semibold text-gray-700 dark:text-gray-200 text-center">
          Our Approach
        </h3>
        <p class="text-gray-600 dark:text-gray-300 text-center">
          We take a client-centric approach, working closely with our clients to
          understand their unique needs and deliver tailored solutions that
          exceed their expectations. We are committed to innovation, quality,
          and customer satisfaction.
        </p>
      </div>
    </div>
  </section>

  {#if teamMembers && teamMembers.length > 0}
    <section class="our-team py-16">
      <div class="container mx-auto space-y-8">
        <h2 class="text-3xl font-semibold text-gray-800 dark:text-white text-center">
          Meet Our Team
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {#each teamMembers as member}
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              {#if member.photo.length > 0}
                <img
                  src={member.photo}
                  alt={member.name}
                  class="rounded-full w-32 h-32 mx-auto mb-4"
                />
              {:else}
                <Icon icon="material-symbols:person-rounded" class="w-32 h-32 bg-slate-400 rounded-full mx-auto mb-4" />
              {/if}
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white text-center">
                {member.name}
              </h3>
              <p class="text-gray-500 dark:text-gray-400 text-center mb-2">
                {member.title}
              </p>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  {#if clients && clients.length > 0}
    <section class="our-clients py-16 bg-gray-100 dark:bg-gray-900">
      <div class="container mx-auto space-y-8">
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
    </section>
  {/if}

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
</main>
