<script>
    import { goto } from '$app/navigation';
</script>

<svelte:head>
    <title>H2 Technologies</title>
</svelte:head>


<div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center bg-base-300 p-10 rounded-xl shadow-xl">
        <div class="max-w-md">
            <h1 class="text-5xl font-bold">404</h1>
            <h2 class="py-6">Oops! The page you're looking for doesn't exist.</h2>
            <button class="btn btn-primary" on:click={() => goto('/')}>Go Home</button>
        </div>
    </div>
</div>