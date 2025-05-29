import { Icon } from "@iconify-icon/react";
import { Metadata } from "next";
import Head from "next/head";

//Constant with our services
const services = [
  {
    title: 'Software & Website Development',
    description: 'Custom software solutions tailored to your unique business needs, from web applications to enterprise platforms. We design and develop user-friendly and scalable websites.',
    type: 'icon',
    icon: 'material-symbols:code-blocks', //  Replace with your actual icon paths
    link: '/services/development',
  },
  {
    title: 'Google Workspace',
    description: 'Enhance collaboration and productivity with Google Workspace. We offer seamless sales, expert administration, and ongoing support to maximize your team\'s efficiency.',
    icon: '/google.png', // Replace with your actual icon paths
    type: 'png',
    link: '/services/google-workspace',
  },
  {
    title: 'Fortinet Equipment',
    description: 'Secure your digital infrastructure with industry-leading Fortinet hardware. We provide consultation, sales, and implementation of robust security solutions.',
    icon: '/fortinet.png', // Replace with your actual icon paths
    type: 'png',
    link: '/services/fortinet',
  }
]

export const metadata: Metadata = {
  title: "H2 Technologies"
}

export default function Page() {
  return (
    <div>
      <section
        className="hero bg-[url(/herobackground.jpg)] bg-cover bg-center backdrop-blur-sm flex items-center justify-center"
      >
        <div className="hero-content text-center max-w-3xl">
          <h1 className="hero-headline text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
            Empowering Your Business with Innovative Technology Solutions
          </h1>
          <p className="hero-description text-lg sm:text-xl text-white mb-8 sm:mb-12 leading-relaxed">
            H2 Technologies LLC provides comprehensive solutions in custom software and website development, Google Workspace sales and administration, and robust Fortinet security equipment to help your business thrive.
          </p>
          <div className="hero-buttons flex flex-wrap justify-center gap-4">
            <a
              href="/contact"
              className="primary-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-transform transform hover:translate-y-[-2px] shadow-lg hover:shadow-xl"
            >
              Get a Free Consulation
            </a>
          </div>
        </div>
      </section>

      <section className="services-overview py-16 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto text-center">
          <h2 className="section-title text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-8">Our Services</h2>
          <div className="service-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="service-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-transform transform hover:scale-105">
                <div className="service-icon mb-4">
                  { 
                    service.type == "png" 
                    ? <img src={service.icon} alt={service.title} className="w-12 h-12 mx-auto" /> 
                    : <Icon icon={service.icon} className="w-[2rem] h-[2rem] mx-auto bg-white rounded-md" />
                  
                  }
                </div>
                <h3 className="service-title text-xl font-semibold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                <p className="service-description text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                <a href={service.link} className="learn-more-link text-blue-500 hover:text-blue-700 transition-colors">Learn More</a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
