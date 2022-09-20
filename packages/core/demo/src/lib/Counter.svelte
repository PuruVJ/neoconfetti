<script lang="ts">
	import { confetti } from '@neoconfetti/core';
	import { onMount } from 'svelte';

	let colors: string[] | undefined = undefined;

	let render = {};

	onMount(() => {
		setTimeout(() => {
			// render = {};
			colors = ['#eee', 'black'];
		}, 2000);
	});
</script>

{#key render}
	<div use:confetti={{ shouldDestroyAfterDone: false, colors }} />
{/key}

<!-- <ConfettiExplosion shouldDestroyAfterDone={false} particleCount={4} /> -->
<style>
</style>
