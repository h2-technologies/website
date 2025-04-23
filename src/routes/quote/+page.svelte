<script lang="ts">
	import { enhance } from "$app/forms";
  import { useForm } from "svelte-use-form";

  const form = useForm();

  // Form data structure
  let formData = $state({
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
    files: [] as File[],
    numEmployees: "",
    numLocations: "",
    networkInfrastructure: "",
    securityRequirements: "",
    complianceRequirements: "",
  });
</script>

<svelte:head>
	<title>Request a Quote | H2 Technologies</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
    Get a Custom Quote
  </h1>
  <p class="text-gray-600 dark:text-gray-400 mb-8">
    Please fill out the form below with your project details. We will provide you
    with a personalized quote within 24-48 hours. Your information is secure and
    will be kept confidential.
  </p>

  <form use:form use:enhance enctype="multipart/form-data" class="space-y-6" method="POST">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="fullName" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >Full Name</label
        >
        <input
          id="fullName"
          type="text"
          name="fullName"
          bind:value={formData.fullName}
          required
          placeholder="John Doe"
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
          name="email"
          bind:value={formData.email}
          required
          placeholder="john.doe@example.com"
          class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >Phone Number</label
        >
        <input
          id="phone"
          type="tel"
          name="phone"
          bind:value={formData.phone}
          placeholder="123-456-7890"
          class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label for="companyName" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >Company Name (Optional)</label
        >
        <input
          id="companyName"
          type="text"
          name="companyName"
          bind:value={formData.companyName}
          placeholder="Acme Corp"
          class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
    </div>

    <div>
      <label for="serviceCategory" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Service Category</label
      >
      <select
        id="serviceCategory"
        bind:value={formData.serviceCategory}
        name="serviceCategory"
        required
        class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
      >
        <option value="">Select a category</option>
        <option value="Software/Website Development"
          >Software/Website Development</option
        >
        <option value="Google Workspace">Google Workspace</option>
        <option value="Fortinet Equipment">Fortinet Equipment</option>
      </select>
    </div>

    <div>
      <label for="projectTitle" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Project Title/Name</label
      >
      <input
        id="projectTitle"
        type="text"
        name="projectTitle"
        bind:value={formData.projectTitle}
        required
        placeholder="New Website Design"
        class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
      />
    </div>

    <div>
      <label for="projectDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Project Description</label
      >
      <textarea
        id="projectDescription"
        name="projectDescription"
        bind:value={formData.projectDescription}
        required
        placeholder="Describe your project in detail..."
        class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
      ></textarea>
    </div>

    <div>
      <label for="projectGoals" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Project Goals</label
      >
      <textarea
        id="projectGoals"
        name="projectGoals"
        bind:value={formData.projectGoals}
        placeholder="Describe your project goals..."
        class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
      ></textarea>
    </div>

    <div>
      <label for="targetAudience" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Target Audience</label
      >
      <textarea
        id="targetAudience"
        name="targetAudience"
        bind:value={formData.targetAudience}
        placeholder="Who is the target audience?..."
        class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
      ></textarea>
    </div>

    <div>
      <label for="keyFeatures" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Key Features</label
      >
      <textarea
        id="keyFeatures"
        name="keyFeatures"
        bind:value={formData.keyFeatures}
        placeholder="List the key features of your project..."
        class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
      ></textarea>
    </div>

    {#if formData.serviceCategory === "Software/Website Development"}
      <div>
        <label for="devRequirements" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >Technical Requirements/Preferences (Software/Website Development)</label
        >
        <textarea
          id="devRequirements"
          name="devRequirements"
          bind:value={formData.devRequirements}
          placeholder="Preferred languages, platforms, CMS, etc."
          class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
        ></textarea>
      </div>
    {/if}

    {#if formData.serviceCategory === "Google Workspace"}
      <div>
        <label for="workspaceRequirements" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >Google Workspace Requirements</label
        >
        <textarea
          id="workspaceRequirements"
          name="workspaceRequirements"
          bind:value={formData.workspaceRequirements}
          placeholder="Number of users, specific apps needed..."
          class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
        ></textarea>
      </div>
    {/if}

    {#if formData.serviceCategory === "Fortinet Equipment"}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="numEmployees" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Number of Employees</label
          >
          <input
            id="numEmployees"
            name="numEmployees"
            type="number"
            bind:value={formData.numEmployees}
            placeholder="e.g., 100"
            class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div>
          <label for="numLocations" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >Number of Locations</label
          >
          <input
            id="numLocations"
            type="number"
            name="numLocations"
            bind:value={formData.numLocations}
            placeholder="e.g., 5"
            class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>
      <div>
        <label for="networkInfrastructure" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >Current Network Infrastructure (Fortinet)</label
        >
        <textarea
          id="networkInfrastructure"
          name="networkInfrastructure"
          bind:value={formData.networkInfrastructure}
          placeholder="Describe your current network setup..."
          class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
        ></textarea>
      </div>
      <div>
        <label for="securityRequirements" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >Specific Security Requirements (Fortinet)</label
        >
        <textarea
          id="securityRequirements"
          name="securityRequirements"
          bind:value={formData.securityRequirements}
          placeholder="Firewall, VPN, intrusion prevention, etc."
          class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
        ></textarea>
      </div>
      <div>
        <label for="complianceRequirements" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >Compliance Requirements (Fortinet)</label
        >
        <textarea
          id="complianceRequirements"
          name="complianceRequirements"
          bind:value={formData.complianceRequirements}
          placeholder="HIPAA, PCI DSS, etc."
          class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
        ></textarea>
      </div>
    {/if}

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label for="startDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >Desired Start Date</label
        >
        <input
          id="startDate"
          type="date"
          name="startDate"
          bind:value={formData.startDate}
          class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
      <div>
        <label for="endDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >Desired Completion Date/Deadline</label
        >
        <input
          id="endDate"
          type="date"
          name="endDate"
          bind:value={formData.endDate}
          class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
        />
      </div>
    </div>

    <div>
      <label for="budget" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Budget</label
      >
      <input
        id="budget"
        name="budget"
        type="text"
        bind:value={formData.budget}
        placeholder="$10,000 - $20,000"
        class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
      />
    </div>

    <div>
      <label for="existingSystems" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Existing Systems/Infrastructure</label
      >
      <textarea
        id="existingSystems"
        name="existingSystems"
        bind:value={formData.existingSystems}
        placeholder="Describe any systems that need to be integrated with..."
        class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]"
      ></textarea>
    </div>

    <div>
      <label for="files" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >Files Upload</label
      >
      <input
        id="files"
        type="file"
        name="files"
        multiple
        class="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
      />
      {#if formData.files && formData.files.length > 0}
        <div class="mt-2">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Uploaded Files:
          </p>
          <ul>
            {#each formData.files as file}
              <li class="text-sm text-gray-700 dark:text-gray-300">{file.name}</li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>

    <button type="submit" class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors duration-300">
      Submit Quote Request
    </button>
  </form>
  <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
    <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
      Need More Assistance?
    </h2>
    <p class="text-gray-600 dark:text-gray-400">
      If you have any questions or prefer to contact us directly, please reach
      out to us using the information below.
    </p>
    <div class="mt-4">
      <p class="text-gray-700 dark:text-gray-300">
        Phone: <span class="font-semibold">567-261-0762</span>
      </p>
      <p class="text-gray-700 dark:text-gray-300">
        Email: <span class="font-semibold">info@h2technologiesllc.com</span>
      </p>
    </div>
  </div>
</div>
