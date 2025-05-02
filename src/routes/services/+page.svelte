<script>
  // Dummy data for services (replace with your actual data)
  const services = [
    {
      title: 'Software & Website Development',
      description:
        'We create custom software solutions tailored to your unique business needs. Our services include web application development, enterprise software, e-commerce solutions, and mobile app development. We use the latest technologies to deliver scalable, secure, and user-friendly software.',
      features: [
        'Custom web application development',
        'Enterprise software solutions',
        'E-commerce development',
        'Mobile app development (iOS and Android)',
        'Scalable and secure architecture',
        'User-friendly design',
        'Ongoing maintenance and support',
      ],
      image: 'material-symbols:code-blocks', // Replace with your actual image path
    },
    {
      title: 'Google Workspace',
      description:
        'We help businesses leverage the full potential of Google Workspace to enhance productivity and collaboration. Our services include sales, deployment, training, and ongoing support. We ensure a smooth transition to Google Workspace and provide solutions to optimize your team\'s workflow.',
      features: [
        'Google Workspace sales and licensing',
        'Seamless deployment and migration',
        'Customized training programs',
        'Change management and adoption support',
        'Integration with existing systems',
        'Ongoing administration and support',
        'Optimization of workflows',
      ],
      image: '/google.png', // Replace with your actual image path
    },
    {
      title: 'Fortinet Equipment',
      description:
        'We offer comprehensive Fortinet solutions to protect your business from cyber threats. Our services include consultation, sales, implementation, and management of Fortinet\'s industry-leading security products. We help you build a robust security posture to safeguard your data and infrastructure.',
      features: [
        'Fortinet product consultation and sales',
        'Network security assessment',
        'Firewall implementation and management',
        'VPN and secure remote access',
        'Intrusion prevention and detection',
        'Endpoint security',
        'Ongoing security monitoring and support',
      ],
      image: '/fortinet.png', // Replace with your actual image path
    },
  ];
</script>

<main class="services-page">
  <header class="bg-gray-100 dark:bg-gray-900 py-16 text-center">
    <div class="container mx-auto">
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white">Our Services</h1>
      <p class="text-gray-600 dark:text-gray-300 mt-4">
        We offer a comprehensive range of technology solutions to help your business
        thrive.
      </p>
    </div>
  </header>

  <section class="service-details py-16">
    <div class="container mx-auto space-y-12">
      {#each services as service}
        <div
          class="service-item grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        >
          <div class="service-image">
            <img
              src={service.image}
              alt={service.title}
              class="rounded-lg shadow-lg w-full"
            />
          </div>
          <div class="service-content">
            <h2 class="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
              {service.title}
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              {service.description}
            </p>
            <ul class="list-disc list-inside space-y-2">
              {#each service.features as feature}
                <li class="text-gray-700 dark:text-gray-200">{feature}</li>
              {/each}
            </ul>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <section class="call-to-action bg-blue-100 dark:bg-blue-900 py-16 text-center">
    <div class="container mx-auto">
      <h2 class="text-3xl sm:text-4xl font-bold text-blue-700 dark:text-blue-200 mb-4">
        Ready to Get Started?
      </h2>
      <p class="text-gray-600 dark:text-gray-300 mb-8">
        Contact us today to discuss your project and discover how our services can
        help your business grow.
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

<style>

  @media (min-width: 768px) {
    .service-content {
      margin-top: 0;
    }
  }
</style>
