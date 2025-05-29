import Form from 'next/form'
import { Metadata } from "next"
import { Icon } from "@iconify-icon/react"
import { sendContactData } from './actions'

export const metadata: Metadata = {
  title: "Contact Us | H2 Technologies",
}

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
        Contact Us
      </h1>

      <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
        We'd love to hear from you! Please fill out the htmlForm below or use the contact information to get
        in touch.
      </p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="contact-htmlForm">
          <Form action={sendContactData} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Name</label
              >
              <input id="name" name="name"
                type="text" 
                required placeholder="Your Name" className="mt-1 block w-full border border-gray-300 dark:border-gray-700
					rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500
					dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Email Address</label
              >
              <input id="email" name="email"
                type="email" 
                required placeholder="your.email@example.com" className="mt-1 block w-full border border-gray-300
					dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500
					focus:border-blue-500 dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Subject</label
              >
              <input id="subject" name="subject"
                type="text" 
                placeholder="Subject of your inquiry" className="mt-1 block w-full border border-gray-300 dark:border-gray-700
					rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500
					dark:bg-gray-800 dark:text-white" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >Message</label
              >
              <textarea id="message" name="message"
                maxLength={400} required placeholder="Your message..." className="mt-1 block w-full border border-gray-300
						dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500
						focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]" ></textarea
              >
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-blue-500 px-4 py-2 font-bold text-white shadow-md transition-colors duration-300 hover:bg-blue-700"
            >
              Send Message
            </button>
          </Form>
        </div>

        <div className="contact-info">
          <h2 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
            Our Contact formation
          </h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-2">
              <Icon icon="material-symbols:phone-enabled" className="h-6 w-6 text-blue-500" />
              <span className="text-gray-700 dark:text-gray-300">567-261-0762</span>
            </li>
            <li className="flex items-center gap-2">
              <Icon icon="material-symbols:stacked-email" className="h-6 w-6 text-blue-500" />
              <span className="text-gray-700 dark:text-gray-300">info@h2technologiesllc.com</span>
            </li>
          </ul>

          <h2 className="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
            Connect With Us
          </h2>
          <div className="social-links flex gap-4">
            <a
              href="https://www.facebook.com/profile.php?id=61572878831678"
              className="text-blue-500 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Facebook
            </a>
            <a
              href="https://www.linkedin.com/company/h2technologiesllc"
              className="text-blue-500 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}