<script lang="ts">
  import { useForm, validators, email, required } from 'svelte-use-form';
  let { data } = $props();
  const form = useForm();
</script>

<svelte:head>
  <title>Contact Us | H2 Technologies</title>
</svelte:head>

<div class="pt-2">
  <h1 class="text-xl">If you'd like to get in touch, please fill out this form and we will reach out.</h1>
</div>
<div>
  <form use:form method="POST" class="w-[500px] mx-auto my-0 border-neutral-300 border-[1px] border-solid">
    <div class="py-3 text-center">
      <label class="text-xl font-bold" for="name">Name:</label>
      <br>
      <input type="text" name="name" id="name" use:validators={[required]} class="w-[90%]">
    </div>
    <div class="py-3 text-center">
      <label class="text-xl font-bold" for="email">Email:</label>
      <br>
      <input type="email" name="email" id="email" use:validators={[email, required]} class="w-[90%]">
    </div>
    <div class="py-3 text-center">
      <label class="text-xl font-bold" for="message">Message:</label>
      <textarea name="message" id="message" rows="10" cols="30" use:validators={[required]} class="w-[90%]"></textarea>
    </div>
    <div class="py-3 text-center">
      <button disabled={!$form.valid} type="submit" class="bg-emerald-500 text-white w-28 h-10 text-xl">Submit</button>
    </div>
  </form>
</div>