<script lang="ts">
	// import { ConfettiExplosion } from '$lib';
	import { ConfettiExplosion } from 'svelte-confetti-explosion';
</script>

<div>
	<ConfettiExplosion particleCount={100} force={0.3} shouldDestroyAfterDone={false} />
</div>

<style lang="scss">
	:global(body) {
		overflow: hidden;
	}

	div {
		position: absolute;
		top: 20%;
		left: 40%;
		right: 0;
		bottom: 0;
		background: rgba(255, 255, 255, 0.5);
	}
</style>
