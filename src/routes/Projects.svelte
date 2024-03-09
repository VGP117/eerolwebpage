<script lang="ts">
	import matopeliThumb from "$lib/images/matopeli-thumb.png"
	import dawdleBlockThumb from "$lib/images/dawdle-block-thumb.png"
	import lentokonepelixThumb from "$lib/images/lentokonepeli-x-thumb.png"
	import swagmanThumb from "$lib/images/swag-man-thumb.png"
	import theBouncingBallThumb from "$lib/images/thebouncingball-thumb.png"
	interface Project {
		name: string
		thumb: string
		href: string
		tags: string[]
	}
	const projects: Project[] = [
		{
			name: "Matopeli",
			thumb: matopeliThumb,
			href: "/matopeli",
			tags: ["Game", "Rust", "Bevy", "Multiplayer", "Multiplatform"],
		},
		{
			name: "Dawdle Block",
			thumb: dawdleBlockThumb,
			href: "https://github.com/eero-lehtinen/dawdle-block",
			tags: [
				"Browser extension",
				"Preact",
				"TypeScript",
				"Jest",
				"Material-UI",
				"Webpack",
			],
		},
		{
			name: "Lentokonepeli-X",
			thumb: lentokonepelixThumb,
			href: "https://github.com/eero-lehtinen/lentokonepeli-x",
			tags: ["Game", "C++", "Windows", "Multiplayer"],
		},
		{
			name: "Swag-Man",
			thumb: swagmanThumb,
			href: "https://github.com/eero-lehtinen/swag-man",
			tags: ["Game", "Java", "Singleplayer"],
		},
		{
			name: "TheBouncingBall",
			thumb: theBouncingBallThumb,
			href: "https://play.google.com/store/apps/details?id=com.SGNG.TheBouncingBall&hl=en&gl=US",
			tags: ["Game", "Unity", "UnityScript", "C#", "Android", "Singleplayer"],
		},
	]
</script>

<section class="mx-auto flex max-w-[700px] flex-col items-stretch">
	<h2 class="m-4 mx-auto text-4xl font-semibold">Projects</h2>
	<div class="flex flex-col gap-2">
		{#each projects as project}
			<a
				href={project.href}
				class="flex gap-4 rounded-lg p-5 hover:bg-gray-300"
			>
				<img
					class="size-16 rounded-lg"
					src={project.thumb}
					alt={`${project.name} thumbnail`}
				/>
				<div class="flex flex-col justify-between">
					<h3 class="text-2xl font-semibold">{project.name}</h3>
					<div class="flex flex-wrap gap-1">
						{#each project.tags as tag}
							<div class="rounded border-2 border-gray-400 px-1 py-0">
								{tag}
							</div>
						{/each}
					</div>
				</div>
			</a>
		{/each}
	</div>
</section>
