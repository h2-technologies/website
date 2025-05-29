import { Icon } from "@iconify-icon/react";
import { Metadata } from "next";

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

const clients = [
  { name: 'Bandit Machine', logo: '/clients/bandit-machine.png' }
];

export const metadata: Metadata = {
  title: "About Us | H2 Technologies",
}

export default function AboutPage() {
  return (
    <main className="about-us-page">
      <header className="bg-gray-100 dark:bg-gray-900 py-16 text-center">
        <div className="container mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 dark:text-white">
            About Us
          </h1>
        </div>
      </header>

      <section className="company-overview py-16 dark:bg-[#1e2329]">
        <div className="container mx-auto space-y-8">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
            Company Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Our Mission
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our mission is to empower businesses with innovative technology
                solutions that drive growth, efficiency, and security.
              </p>
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mt-6">
                Our Vision
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                To be a leading technology partner, recognized for our expertise,
                innovation, and commitment to client success.
              </p>
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mt-6">
                Our Values
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Excellence</li>
                <li>Integrity</li>
                <li>Collaboration</li>
                <li>Innovation</li>
                <li>Customer Satisfaction</li>
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Who We Are
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
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

      <section className="what-we-do py-16 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto space-y-8">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white text-center">
            What We Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Software and Website Development
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We create custom software solutions and websites tailored to your
                business needs.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Google Workspace Solutions
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We provide comprehensive Google Workspace solutions to enhance
                productivity and collaboration.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Fortinet Equipment and Security Solutions
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We offer Fortinet's industry-leading security products to protect
                your business from cyber threats.
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 text-center">
              Our Approach
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center">
              We take a client-centric approach, working closely with our clients to
              understand their unique needs and deliver tailored solutions that
              exceed their expectations. We are committed to innovation, quality,
              and customer satisfaction.
            </p>
          </div>
        </div>
      </section>
      {
        teamMembers && teamMembers.length > 0 ?
          <section className="our-team py-16 bg-[#1e2329]">
            <div className="container mx-auto space-y-8">
              <h2 className="text-3xl font-semibold text-gray-800 dark:text-white text-center">
                Meet Our Team
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {teamMembers.map((member) => (
                  <div key={member.name.replaceAll(" ", "_")} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    {
                      member.photo.length > 0
                      ? <img src={member.photo} alt={member.name} className="rounded-full w-32 h-32 mx-auto mb-4" />
                      : <Icon icon="material-symbols:person-rounded" className="w-32 h-32 bg-slate-400 rounded-full mx-auto mb-4" />
                    }
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                      {member.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center mb-2">
                      {member.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          : null
      }

      {
        clients && clients.length > 0 ?
        <section className="our-clients py-16 bg-gray-100 dark:bg-gray-900">
          <div className="container mx-auto space-y-8">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white text-center">
              Our Clients
            </h2>
            <div className="flex flex-wrap justify-center gap-8">
              {clients.map((client) => (
                <div key={client.name.replaceAll(" ", "-")} className="client-logo">
                  <img key={client.name.replaceAll(" ", "-")} src={client.logo} alt={client.name} className="h-16" />
                </div>
              ))}
            </div>
          </div>
        </section>
        : null
      }

      <section className="contact-information py-16 bg-[#1e2329]">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            We'd love to hear from you. Contact us today to learn more about how we
            can help your business.
          </p>
          <a
            href="/contact"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition-colors duration-300"
          >
            Contact Us
          </a>
        </div>
      </section>
    </main>
  )
}