<script lang="ts">
  import { useForm, validators, email, required } from 'svelte-use-form';
  let { data } = $props();
  const form = useForm();
</script>

<svelte:head>
  <title>Contact Us | H2 Technologies</title>
</svelte:head>

<div class="pt-8">
  <h1 class="px-0 pb-2 text-2xl text-cyan-700 font-bold text-center">If you'd like to get in touch, please fill out this form and we will reach out.</h1>
</div>
<div class="sm:mb-20 md:mb-96 lg:mb-96 ">
  <form use:form method="POST" class="sm:w-fit lg:w-[500px] md:w-[500px] h-fit mx-auto align-middle my-0 border-neutral-300 border-[1px] border-solid">
    <div class="py-3 text-center">
      <label class="text-xl font-bold" for="name">Name:</label>
      <br>
      <input type="text" name="name" id="name" use:validators={[required]} class="w-[90%] rounded-lg">
    </div>
    <div class="py-3 text-center">
      <label class="text-xl font-bold" for="email">Email:</label>
      <br>
      <input type="email" name="email" id="email" use:validators={[email, required]} class="w-[90%] rounded-lg">
    </div>
    <div class="py-3 text-center">
      <label class="text-xl font-bold" for="message">Message:</label>
      <textarea name="message" id="message" rows="10" cols="30" use:validators={[required]} class="w-[90%] rounded-lg"></textarea>
    </div>
    <div class="py-3 text-center">
      <button disabled={!$form.valid} type="submit" class="bg-cyan-700 text-white w-28 h-10 text-xl lg:mb-96 rounded-lg">Submit</button>
    </div>
  </form>
</div>