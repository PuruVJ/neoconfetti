<script lang="ts">
	import { confetti, type ConfettiParticleShape } from '@neoconfetti/core';
	import { onMount } from 'svelte';

	let colors: string[] | undefined = undefined;
	let particleShape: ConfettiParticleShape = 'mix';
	let force = 0.5;

	let particleClass = 'particlesss';

	let showConfetti = false;

	onMount(() => {
		setTimeout(() => {
			showConfetti = true;
		}, 500);

		setTimeout(() => {
			// render = {};
			colors = ['#eee', 'black'];
			particleShape = 'circles';

			// force = 1;
		}, 2000);
	});
</script>

<input bind:value={particleClass} />

{#if showConfetti}
	<div
		use:confetti={{
			destroyAfterDone: false,
			colors,
			particleShape,
			force,
			particleClass,
		}}
	/>
{/if}

<!-- <ConfettiExplosion destroyAfterDone={false} particleCount={4} /> -->
<style>
</style>
