'use client'

import { FormEvent, FormEventHandler, useState } from "react";
import { handleQuoteForm } from "./actions";
import Form from "next/form";

export default function QuotePage() {
  //@ts-ignore - No clue what this type is 
  function handleChange(event) {
    console.log(typeof event);
    const { name, value, type, files } = event.target;
    if (type === 'file') {
      setFormData(prevData => ({
        ...prevData,
        files: Array.from(files) // Convert FileList to an array of File objects
      }))
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }))
    }
  }

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    serviceCategory: "",
    projectTitle: "",
    projectDescription: "",
    projectGoals: "",
    targetAudience: "",
    keyFeatures: "",
    devRequirements: "",
    workspaceRequirements: "",
    fortinetRequirements: "",
    startDate: "",
    endDate: "",
    budget: "",
    existingSystems: "",
    files: [], // Storing File objects directly
    numEmployees: "",
    numLocations: "",
    networkInfrastructure: "",
    securityRequirements: "",
    complianceRequirements: "",
  });

  return (
    <div className="container mx-auto px-4 py-8 font-inter">

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Get a Custom Quote
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Please fill out the form below with your project details. We will provide you
        with a personalized quote within 24-48 hours. Your information is secure and
        will be kept confidential.
      </p>

      <Form action={handleQuoteForm} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="john.doe@example.com"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="123-456-7890"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Company Name (Optional)
            </label>
            <input
              id="companyName"
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Acme Corp"
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label htmlFor="serviceCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Service Category
          </label>
          <select
            id="serviceCategory"
            value={formData.serviceCategory}
            onChange={handleChange}
            name="serviceCategory"
            required
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          >
            <option value="">Select a category</option>
            <option value="Software/Website Development">Software/Website Development</option>
            <option value="Google Workspace">Google Workspace</option>
            <option value="Fortinet Equipment">Fortinet Equipment</option>
          </select>
        </div>

        <div>
          <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Project Title/Name
          </label>
          <input
            id="projectTitle"
            type="text"
            name="projectTitle"
            value={formData.projectTitle}
            onChange={handleChange}
            required
            placeholder="New Website Design"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Project Description
          </label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
            required
            placeholder="Describe your project in detail..."
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
          ></textarea>
        </div>

        <div>
          <label htmlFor="projectGoals" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Project Goals
          </label>
          <textarea
            id="projectGoals"
            name="projectGoals"
            value={formData.projectGoals}
            onChange={handleChange}
            placeholder="Describe your project goals..."
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
          ></textarea>
        </div>

        <div>
          <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Target Audience
          </label>
          <textarea
            id="targetAudience"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            placeholder="Who is the target audience?..."
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
          ></textarea>
        </div>

        <div>
          <label htmlFor="keyFeatures" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Key Features
          </label>
          <textarea
            id="keyFeatures"
            name="keyFeatures"
            value={formData.keyFeatures}
            onChange={handleChange}
            placeholder="List the key features of your project..."
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
          ></textarea>
        </div>

        {formData.serviceCategory === "Software/Website Development" && (
          <div>
            <label htmlFor="devRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Technical Requirements/Preferences (Software/Website Development)
            </label>
            <textarea
              id="devRequirements"
              name="devRequirements"
              value={formData.devRequirements}
              onChange={handleChange}
              placeholder="Preferred languages, platforms, CMS, etc."
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
            ></textarea>
          </div>
        )}

        {formData.serviceCategory === "Google Workspace" && (
          <div>
            <label htmlFor="workspaceRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Google Workspace Requirements
            </label>
            <textarea
              id="workspaceRequirements"
              name="workspaceRequirements"
              value={formData.workspaceRequirements}
              onChange={handleChange}
              placeholder="Number of users, specific apps needed..."
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
            ></textarea>
          </div>
        )}

        {formData.serviceCategory === "Fortinet Equipment" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="numEmployees" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Number of Employees
                </label>
                <input
                  id="numEmployees"
                  name="numEmployees"
                  type="number"
                  value={formData.numEmployees}
                  onChange={handleChange}
                  placeholder="e.g., 100"
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="numLocations" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Number of Locations
                </label>
                <input
                  id="numLocations"
                  type="number"
                  name="numLocations"
                  value={formData.numLocations}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label htmlFor="networkInfrastructure" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Network Infrastructure (Fortinet)
              </label>
              <textarea
                id="networkInfrastructure"
                name="networkInfrastructure"
                value={formData.networkInfrastructure}
                onChange={handleChange}
                placeholder="Describe your current network setup..."
                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
              ></textarea>
            </div>
            <div>
              <label htmlFor="securityRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Specific Security Requirements (Fortinet)
              </label>
              <textarea
                id="securityRequirements"
                name="securityRequirements"
                value={formData.securityRequirements}
                onChange={handleChange}
                placeholder="Firewall, VPN, intrusion prevention, etc."
                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
              ></textarea>
            </div>
            <div>
              <label htmlFor="complianceRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Compliance Requirements (Fortinet)
              </label>
              <textarea
                id="complianceRequirements"
                name="complianceRequirements"
                value={formData.complianceRequirements}
                onChange={handleChange}
                placeholder="HIPAA, PCI DSS, etc."
                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
              ></textarea>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Desired Start Date
            </label>
            <input
              id="startDate"
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Desired Completion Date/Deadline
            </label>
            <input
              id="endDate"
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Budget
          </label>
          <input
            id="budget"
            name="budget"
            type="text"
            value={formData.budget}
            onChange={handleChange}
            placeholder="$10,000 - $20,000"
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="existingSystems" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Existing Systems/Infrastructure
          </label>
          <textarea
            id="existingSystems"
            name="existingSystems"
            value={formData.existingSystems}
            onChange={handleChange}
            placeholder="Describe any systems that need to be integrated with..."
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
          ></textarea>
        </div>

        <div>
          <label htmlFor="files" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Files Upload
          </label>
          <input
            id="files"
            type="file"
            name="files"
            multiple
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
          {formData.files && formData.files.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Uploaded Files:
              </p>
              <ul>
                {formData.files.map((file, index) => (
                  <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                    {file.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-300">
          Submit Quote Request
        </button>
      </Form>
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Need More Assistance?
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          If you have any questions or prefer to contact us directly, please reach
          out to us using the information below.
        </p>
        <div className="mt-4">
          <p className="text-gray-700 dark:text-gray-300">
            Phone: <span className="font-semibold">567-261-0762</span>
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            Email: <span className="font-semibold">info@h2technologiesllc.com</span>
          </p>
        </div>
      </div>
    </div>
  )
}