<script lang="ts">
	import { ConfettiExplosion } from '$lib';
</script>

<div>
	<ConfettiExplosion
		particleCount={100}
		force={0.999998}
		particlesShape="circles"
		shouldDestroyAfterDone={false}
		--x="-100px"
		--y="200px"
	/>
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
