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
	import { onMount } from 'svelte';
	import {
		coinFlip,
		mapRange,
		rotate,
		rotationTransforms,
		round,
		shouldBeCircle,
		waitFor,
	} from './utils';

	export let particleCount = PARTICLE_COUNT;
	export let duration = DURATION;
	export let colors = COLORS;
	export let particleSize = SIZE;
	export let force = FORCE;
	export let floorHeight = FLOOR_HEIGHT;
	export let floorWidth = FLOOR_WIDTH;

	const particles = createParticles(particleCount, colors);

	let isVisible = true;

	onMount(async () => {
		await waitFor(duration);

		isVisible = false;
	});

	function confettiStyles(node: HTMLDivElement, { degree }: { degree: number }) {
		// Get x landing point for it
		const landingPoint = mapRange(
			Math.abs(rotate(degree, 90) - 180),
			0,
			180,
			-floorWidth / 2,
			floorWidth / 2
		);

		// Crazy calculations for generating styles
		const rotation = Math.random() * (ROTATION_SPEED_MAX - ROTATION_SPEED_MIN) + ROTATION_SPEED_MIN;
		const rotationIndex = Math.round(Math.random() * (rotationTransforms.length - 1));
		const durationChaos = duration - Math.round(Math.random() * 1000);
		const shouldBeCrazy = Math.random() < CRAZY_PARTICLES_FREQUENCY;
		const isCircle = shouldBeCircle(rotationIndex);

		// x-axis disturbance, roughly the distance the particle will initially deviate from its target
		const x1 = shouldBeCrazy ? round(Math.random() * CRAZY_PARTICLE_CRAZINESS, 2) : 0;
		const x2 = x1 * -1;
		const x3 = x1;
		// x-axis arc of explosion, so 90deg and 270deg particles have curve of 1, 0deg and 180deg have 0
		const x4 = round(Math.abs(mapRange(Math.abs(rotate(degree, 90) - 180), 0, 180, -1, 1)), 4);

		// roughly how fast particle reaches end of its explosion curve
		const y1 = round(Math.random() * BEZIER_MEDIAN, 4);
		// roughly maps to the distance particle goes before reaching free-fall
		const y2 = round(Math.random() * force * (coinFlip() ? 1 : -1), 4);
		// roughly how soon the particle transitions from explosion to free-fall
		const y3 = BEZIER_MEDIAN;
		// roughly the ease of free-fall
		const y4 = round(Math.max(mapRange(Math.abs(degree - 180), 0, 180, force, -force), 0), 4);

		node.style.setProperty('--x-landing-point', `${landingPoint}px`);

		node.style.setProperty('--duration-chaos', `${durationChaos}ms`);

		node.style.setProperty('--x1', `${x1}`);
		node.style.setProperty('--x2', `${x2}`);
		node.style.setProperty('--x3', `${x3}`);
		node.style.setProperty('--x4', `${x4}`);

		node.style.setProperty('--y1', `${y1}`);
		node.style.setProperty('--y2', `${y2}`);
		node.style.setProperty('--y3', `${y3}`);
		node.style.setProperty('--y4', `${y4}`);

		// set --width and --height here
		node.style.setProperty(
			'--width',
			`${isCircle ? particleSize : Math.round(Math.random() * 4) + particleSize / 2}px`
		);
		node.style.setProperty(
			'--height',
			(isCircle ? particleSize : Math.round(Math.random() * 2) + particleSize) + 'px'
		);

		node.style.setProperty('--rotation', `${rotationTransforms[rotationIndex].join()}`);
		node.style.setProperty('--rotation-duration', `${rotation}ms`);
		node.style.setProperty('--border-radius', `${isCircle ? '50%' : '0'}`);
	}
</script>

{#if isVisible}
	<div class="container" style="--floor-height: {floorHeight}px;">
		{#each particles as { color, degree }}
			<div class="particle" use:confettiStyles={{ degree }}>
				<div style="--bgcolor: {color};" />
			</div>
		{/each}
	</div>
{/if}

<style lang="scss">
	@keyframes y-axis {
		to {
			transform: translate3d(0, var(--floor-height), 0);
		}
	}

	@keyframes x-axis {
		to {
			transform: translate3d(var(--x-landing-point), 0, 0);
		}
	}

	@keyframes rotation {
		to {
			transform: rotate3d(var(--rotation), 360deg);
		}
	}

	.container {
		width: 0;
		height: 0;

		overflow: visible;

		position: relative;
		z-index: 1200;
	}

	.particle {
		animation: x-axis var(--duration-chaos) forwards
			cubic-bezier(var(--x1), var(--x2), var(--x3), var(--x4));

		div {
			position: absolute;
			top: 0;
			left: 0;

			animation: y-axis var(--duration-chaos) forwards
				cubic-bezier(var(--y1), var(--y2), var(--y3), var(--y4));

			width: var(--width);
			height: var(--height);

			&:before {
				display: block;

				height: 100%;
				width: 100%;

				content: '';
				background-color: var(--bgcolor);

				animation: rotation var(--rotation-duration) infinite linear;

				border-radius: var(--border-radius);
			}
		}
	}
</style>
