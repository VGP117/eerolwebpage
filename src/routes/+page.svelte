<script lang="ts">
	import LandingHeading from './LandingHeading.svelte';
	import Projects from './Projects.svelte';
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="The home page of computer programmer Eero Lehtinen" />
</svelte:head>

<main class="flex flex-col gap-10">
	<LandingHeading />
	<Projects />
</main>
