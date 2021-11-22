<script lang="ts" context="module">
	interface Particle {
		color: string; // color of particle
		degree: number; // vector direction, between 0-360 (0 being straight up ↑)
	}

	const ROTATION_SPEED_MIN = 200; // minimum possible duration of single particle full rotation
	const ROTATION_SPEED_MAX = 800; // maximum possible duration of single particle full rotation
	const CRAZY_PARTICLES_FREQUENCY = 0.1; // 0-1 frequency of crazy curvy unpredictable particles
	const CRAZY_PARTICLE_CRAZINESS = 0.3; // 0-1 how crazy these crazy particles are
	const BEZIER_MEDIAN = 0.5; // utility for mid-point bezier curves, to ensure smooth motion paths

	const FORCE = 0.5; // 0-1 roughly the vertical force at which particles initially explode
	const SIZE = 12; // max height for particle rectangles, diameter for particle circles
	const FLOOR_HEIGHT = 800; // pixels the particles will fall from initial explosion point
	const FLOOR_WIDTH = 1600; // horizontal spread of particles in pixels
	const PARTICLE_COUNT = 150;
	const DURATION = 3500;
	const COLORS = ['#FFC700', '#FF0000', '#2E3191', '#41BBC7'];

	const createParticles = (count: number, colors: string[]): Particle[] => {
		const increment = 360 / count;
		return Array.from({ length: count }, (_, i) => ({
			color: colors[i % colors.length],
			degree: i * increment,
		}));
	};
</script>

<script lang="ts">
	export let particleCount = PARTICLE_COUNT;
	export let duration = DURATION;
	export let colors = COLORS;
	export let particleSize = SIZE;
	export let force = FORCE;
	export let floorHeight = FLOOR_HEIGHT;
	export let floorWidth = FLOOR_WIDTH;

	const particles = createParticles(particleCount, colors);
</script>

<div class="container">
	{#each particles as { degree, color }}
		<div class="particle" style="--color: {color}">
			<div />
		</div>
	{/each}
</div>

<style lang="scss">
	.container {
		width: 0;
		height: 0;

		overflow: visible;

		position: relative;
		z-index: 1200;
	}

	.particle {
	}
</style>
