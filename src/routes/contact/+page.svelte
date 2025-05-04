<script>
	import { enhance } from '$app/forms';
	import Icon from '@iconify/svelte';
	import { useForm } from 'svelte-use-form';
	const form = useForm();

	// Form data structure
	let contactFormData = $state({
		name: '',
		email: '',
		subject: '',
		message: ''
	});
</script>

<svelte:head>
	<title>Contact Us | H2 Technologies</title>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<h1 class="mb-6 text-center text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
		Contact Us
	</h1>

	<p class="mb-8 text-center text-gray-600 dark:text-gray-400">
		We'd love to hear from you! Please fill out the form below or use the contact information to get
		in touch.
	</p>

	<div class="grid grid-cols-1 gap-8 md:grid-cols-2">
		<div class="contact-form">
			<form use:enhance method="POST" class="space-y-6">
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Name</label
					>
					<input id="name" name="name"
					type="text" bind:value={contactFormData.name}
					required placeholder="Your Name" class="mt-1 block w-full border border-gray-300 dark:border-gray-700
					rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500
					dark:bg-gray-800 dark:text-white" />
				</div>
				<div>
					<label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Email Address</label
					>
					<input id="email" name="email"
					type="email" bind:value={contactFormData.email}
					required placeholder="your.email@example.com" class="mt-1 block w-full border border-gray-300
					dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500
					focus:border-blue-500 dark:bg-gray-800 dark:text-white" />
				</div>
				<div>
					<label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Subject</label
					>
					<input id="subject" name="subject"
					type="text" bind:value={contactFormData.subject}
					placeholder="Subject of your inquiry" class="mt-1 block w-full border border-gray-300 dark:border-gray-700
					rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500
					dark:bg-gray-800 dark:text-white" />
				</div>
				<div>
					<label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300"
						>Message</label
					>
					<textarea id="message" name="message"
						bind:value={contactFormData.message}
						maxlength="400" required placeholder="Your message..." class="mt-1 block w-full border border-gray-300
						dark:border-gray-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500
						focus:border-blue-500 dark:bg-gray-800 dark:text-white min-h-[120px]" ></textarea
					>
				</div>
				<button
					type="submit"
					class="w-full rounded-md bg-blue-500 px-4 py-2 font-bold text-white shadow-md transition-colors duration-300 hover:bg-blue-700"
				>
					Send Message
				</button>
			</form>
		</div>

		<div class="contact-info">
			<h2 class="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
				Our Contact Information
			</h2>
			<ul class="space-y-4">
				<li class="flex items-center gap-2">
					<Icon icon="material-symbols:phone-enabled" class="h-6 w-6 text-blue-500" />
					<span class="text-gray-700 dark:text-gray-300">567-261-0762</span>
				</li>
				<li class="flex items-center gap-2">
					<Icon icon="material-symbols:stacked-email" class="h-6 w-6 text-blue-500" />
					<span class="text-gray-700 dark:text-gray-300">info@h2technologiesllc.com</span>
				</li>
			</ul>

			<h2 class="mb-4 mt-8 text-2xl font-semibold text-gray-900 dark:text-white">
				Connect With Us
			</h2>
			<div class="social-links flex gap-4">
				<a
					href="https://www.facebook.com/profile.php?id=61572878831678"
					class="text-blue-500 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
				>
					Facebook
				</a>
				<a
					href="https://www.linkedin.com/company/h2technologiesllc"
					class="text-blue-500 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
				>
					LinkedIn
				</a>
			</div>
		</div>
	</div>
</div>
