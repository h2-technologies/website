<script lang="ts">
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
  <title>H2 Technologies</title>
</svelte:head>

<header class="px-0 py-8 text-center text-cyan-700 font-bold ">
	<h1>About Us</h1>
</header>
<div class="p-2">
	<div class="p-9 rounded-xl">
		<h2 class="mb-4 text-2xl text-cyan-700 font-bold text-center">Who We Are</h2>
		<div class="flex flex-wrap justify-center">
			<div class="text-center text-amber-600 outline rounded-lg p-5 mr-8 w-64 outline-cyan-700">
				<img src="/austin.jpg" alt="Austin Hadley" class="w-24 h-24 mx-auto rounded-full mb-1 outline outline-cyan-700"/>
				<div class="my-5">
					<h3 class="text-2xl font-bold">Austin Hadley</h3>
					<p class="text-xl">Chief Executive Officer</p>
					<p class="text-sm">Member since 2023</p>
				</div>
				<div class="flex justify-center mt-2">
					<a href="mailto:austinhadley@h2technologiesllc.com" class="outline rounded-full p-1 mr-2 outline-cyan-700">
						<Icon icon="mdi:email" class="text-2xl text-cyan-700"/>
					</a>
					<a href="tel:5672610762,21610" class="outline rounded-full p-1 outline-cyan-700">
						<Icon icon="mdi:phone" class="text-2xl text-cyan-700"/>
					</a>
				</div>
			</div>
			<div class="text-center text-amber-600 outline rounded-lg p-5 mr-8 w-64 outline-cyan-700">
				<img src="/samuel.jpg" alt="Austin Hadley" class="w-24 h-24 mx-auto rounded-full mb-1 outline outline-cyan-700"/>
				<div class="my-5">
					<h3 class="text-2xl font-bold">Samuel Valencia</h3>
					<p class="text-xl ">Chief Operating Officer</p>
					<p class="text-sm">Member since 2023</p>
				</div>
				<div class="flex justify-center mt-2">
					<a href="mailto:samuelvalencia@h2technologiesllc.com" class="outline rounded-full p-1 mr-2 outline-cyan-700">
						<Icon icon="mdi:email" class="text-2xl text-cyan-700"/>
					</a>
					<a href="tel:5672610762,21611" class="outline rounded-full p-1 outline-cyan-700">
						<Icon icon="mdi:phone" class="text-2xl text-cyan-700"/>
					</a>
				</div>
			</div>
			<div class="text-center text-amber-600 outline rounded-lg p-5 mr-8 w-64 outline-cyan-700">
				<Icon icon="mdi:person" class="text-slate-800 w-24 h-24 mx-auto rounded-full mb-1 outline outline-cyan-700"/>
				<div class="my-5">
					<h3 class="text-2xl font-bold">Eric Doepke</h3>
					<p class="text-xl ">Junior Developer</p>
					<p class="text-sm">Member since 2025</p>
				</div>
				<div class="flex justify-center mt-2">
					<a href="mailto:ericdoepke@h2technologiesllc.com" class="outline rounded-full p-1 mr-2 outline-cyan-700">
						<Icon icon="mdi:email" class="text-2xl text-cyan-700"/>
					</a>
					<a href="tel:5672610762,21612" class="outline rounded-full p-1 outline-cyan-700">
						<Icon icon="mdi:phone" class="text-2xl text-cyan-700"/>
					</a>
				</div>
			</div>
			<div class="text-center text-amber-600 outline rounded-lg p-5 w-64 outline-cyan-700">
				<Icon icon="mdi:person" class="text-slate-800 w-24 h-24 mx-auto rounded-full mb-1 outline outline-cyan-700"/>
				<div class="my-5">
					<h3 class="text-2xl font-bold">Joshua Lambert</h3>
					<p class="text-xl ">Junior Graphics Designer</p>
					<p class="text-sm">Member since 2025</p>
				</div>
				<div class="flex justify-center mt-2">
					<a href="mailto:joshualambert@h2technologiesllc.com" class="outline rounded-full p-1 outline-cyan-700">
						<Icon icon="mdi:email" class="text-2xl text-cyan-700"/>
					</a>
					<!-- <a href="tel:5672610762,21612" class="outline rounded-full p-1 outline-cyan-700">
						<Icon icon="mdi:phone" class="text-2xl text-cyan-700"/>
					</a> ADD LATER WHEN RECIEVED PHONE EXT ALSO ADD BACK MR-2 IN EMAIL-->
				</div>
			</div>
		</div>
	</div>
</div>
