<script lang="ts">
	import { confetti } from '@neoconfetti/core';
	import { onMount } from 'svelte';

	let colors: string[] | undefined = undefined;

	let showConfetti = false;

	onMount(() => {
		setTimeout(() => {
			showConfetti = true;
		}, 500);

		setTimeout(() => {
			// render = {};
			colors = ['#eee', 'black'];
		}, 2000);
	});
</script>

{#if showConfetti}
	<div use:confetti={{ destroyAfterDone: false, colors }} />
{/if}

<!-- <ConfettiExplosion shouldDestroyAfterDone={false} particleCount={4} /> -->
<style>
</style>
