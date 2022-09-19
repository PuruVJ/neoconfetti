<script lang="ts">
	import { confetti } from '@neoconfetti/core';
	import { onMount } from 'svelte';

	let colors: string[] | undefined = undefined;

	onMount(() => {
		setTimeout(() => {
			colors = ['#eee', 'black'];
		}, 2000);
	});
</script>

<div use:confetti />

<!-- <ConfettiExplosion shouldDestroyAfterDone={false} particleCount={4} /> -->
<style>
</style>
