<script lang="ts">
	import matopeliVideo from '$lib/images/matopeli.mp4';
</script>

<svelte:head>
	<title>Matopeli</title>
	<meta name="description" content="Matopeli info page" />
</svelte:head>

<main class="mx-auto flex min-w-0 max-w-[1280px] flex-col gap-2 p-4">
	<a href="./" class="text-blue-500 hover:underline">Back</a>
	<section>
		<h1 class="my-4 text-3xl font-semibold">Matopeli</h1>
		<p class="mb-4 max-w-[700px]">
			Matopeli is a twin-stick horde survival multiplayer shooter where you play as a centipede. You
			have lots of hands so why not use them?
		</p>
		<p class="mb-4">Will be coming to PC, Android and iOS. At some point.</p>
	</section>
	<video src={matopeliVideo} width="1280" height="720" controls autoplay loop>
		<track kind="captions" />
	</video>
</main>
