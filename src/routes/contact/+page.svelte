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

<!--TODO: make the div tall enough to fill the screen but short enough to not scroll-->
<div class="px-auto px-4 py-8 bg-gray-200 dark:bg-gray-800 h-screen">
	<h1 class="mb-6 text-center text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
		Contact Us
	</h1>

	<p class="mb-8 text-center text-gray-600 dark:text-gray-400">
		We'd love to hear from you! 
		Please <!-- fill out the form below or --> use the contact information to get
		in touch.
		<i>Contact form coming soon!</i>
	</p>

	<div class="flex justify-center align-middle items-center">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
			<div class="bg-white dark:bg-gray-900 h-52 w-72 rounded-xl p-4">
				<h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2 pt-4">
					Phone
				</h3>
				<p class="text-gray-600 dark:text-gray-300">
					<Icon icon="mdi:phone" class="inline-block mr-2" />
					<a href="tel:+5672610762" class="hover:underline">+1 (567) 261-0762</a>
				</p>
			</div>
			<div class="bg-white dark:bg-gray-900 h-52 w-72 rounded-xl p-4">
				<h3 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2 pt-4">
					Email
				</h3>
				<p class="text-gray-600 dark:text-gray-300">
					<Icon icon="mdi:email" class="inline-block mr-2" />
					<a href="mailto:sales@h2technologiesllc.com" class="hover:underline">sales@h2technologiesllc.com</a>
				</p>
			</div>
		</div>
	</div>

</div>
	