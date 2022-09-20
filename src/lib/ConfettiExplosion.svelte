<script lang="ts" context="module">
	type ParticleShape = 'mix' | 'circles' | 'rectangles';

	const ROTATION_SPEED_MIN = 200; // minimum possible duration of single particle full rotation
	const ROTATION_SPEED_MAX = 800; // maximum possible duration of single particle full rotation
	const CRAZY_PARTICLES_FREQUENCY = 0.1; // 0-1 frequency of crazy curvy unpredictable particles
	const CRAZY_PARTICLE_CRAZINESS = 0.3; // 0-1 how crazy these crazy particles are
	const BEZIER_MEDIAN = 0.5; // utility for mid-point bezier curves, to ensure smooth motion paths

	const abs = Math.abs,
		random = Math.random,
		mathRound = Math.round,
		max = Math.max;

	const createParticles = (count: number, colors: string[]) =>
		Array.from({ length: count }, (_, i) => ({
			color: colors[i % colors.length],
			degree: (i * 360) / count,
		}));

	// From here: https://stackoverflow.com/a/11832950
	const round = (num: number, precision: number = 2) =>
		mathRound((num + Number.EPSILON) * 10 ** precision) / 10 ** precision;

	const mapRange = (value: number, x1: number, y1: number, x2: number, y2: number) =>
		((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

	const rotate = (degree: number, amount: number) =>
		degree + amount > 360 ? degree + amount - 360 : degree + amount;

	const coinFlip = () => random() > 0.5;

	// We can use the first three bits to flag which axis to rotate on.
	// x = binary 100 = decimal 4
	// y = binary 010 = decimal 2
	// z = binary 001 = decimal 1
	// We can use dual axis rotations (a bit more realistic) by combining the above bits.
	// x & y = binary 110 = decimal 6
	// x & z = binary 101 = decimal 5
	// y & z = binary 011 = decimal 3
	const POSSIBLE_ROTATION_TRANSFORMS = 6;

	// avoid rotation on z axis (001 = 1) for circles as it has no visual effect.
	const shouldBeCircle = (rotationTransform: number) => rotationTransform !== 1 && coinFlip();

	const isUndefined = (value: any) => typeof value === 'undefined';

	const error = (message: string) => {
		console.error(message);
		return false;
	};

	const assertPositiveInteger = (val: any, name: string) =>
		!isUndefined(val) && Number.isSafeInteger(val) && val < 0
			? error(name + ' must be a positive integer')
			: true;

	const validate = (
		particleCount: number,
		duration: number,
		colors: string[],
		particleSize: number,
		force: number,
		stageHeight: number,
		stageWidth: number,
		particlesShape: ParticleShape
	) => {
		if (
			!assertPositiveInteger(particleCount, 'particleCount') ||
			!assertPositiveInteger(duration, 'duration') ||
			!assertPositiveInteger(particleSize, 'particleSize') ||
			!assertPositiveInteger(force, 'force') ||
			!assertPositiveInteger(stageHeight, 'stageHeight') ||
			!assertPositiveInteger(stageWidth, 'stageWidth')
		)
			return false;

		if (!isUndefined(particlesShape) && !['mix', 'circles', 'rectangles'].includes(particlesShape))
			return error('particlesShape should be either "mix" or "circles" or "rectangle"');

		if (!isUndefined(colors) && !Array.isArray(colors))
			return error('colors must be an array of strings');

		if (force > 1) return error('force must be within 0 and 1');

		return true;
	};
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	/**
	 * Number of confetti particles to create
	 *
	 * @default 150
	 *
	 * @example
	 *
	 * ```svelte
	 * <ConfettiExplosion particleCount={200} />
	 * ```
	 */
	export let particleCount = 150;

	/**
	 * Size of the confetti particles in pixels
	 *
	 * @default 12
	 *
	 * @example
	 *
	 * ```svelte
	 * <ConfettiExplosion particleSize={20} />
	 * ```
	 */
	export let particleSize = 12;

	/**
	 * Duration of the animation in milliseconds
	 *
	 * @default 3500
	 *
	 * @example
	 *
	 * ```svelte
	 * <ConfettiExplosion duration={5000} />
	 * ```
	 */
	export let duration = 3500;

	/**
	 * Shape of particles to use. Can be `mix`, `circles` or `rectangles`
	 *
	 * `mix` will use both circles and rectangles
	 * `circles` will use only circles
	 * `rectangles` will use only rectangles
	 *
	 * @default 'mix'
	 *
	 * @example
	 *
	 * ```svelte
	 * <ConfettiExplosion particlesShape='circles' />
	 * ```
	 *
	 * @example
	 *
	 * ```svelte
	 * <ConfettiExplosion particlesShape='rectangles' />
	 * ```
	 */
	export let particlesShape: ParticleShape = 'mix';

	/**
	 * Colors to use for the confetti particles. Pass string array of colors. Can use hex colors, named colors,
	 * CSS Variables, literally anything valid in plain CSS.
	 *
	 * @default ['#FFC700', '#FF0000', '#2E3191', '#41BBC7']
	 *
	 * @example
	 *
	 * ```svelte
	 * <ConfettiExplosion colors={['var(--yellow)', 'var(--red)', '#2E3191', '#41BBC7']} />
	 * ```
	 */
	export let colors = ['#FFC700', '#FF0000', '#2E3191', '#41BBC7'];

	/**
	 * Force of the confetti particles. Between 0 and 1. 0 is no force, 1 is maximum force.
	 *
	 * @default 0.5
	 *
	 * @example
	 *
	 * ```svelte
	 * <ConfettiExplosion force={0.8} />
	 * ```
	 */
	export let force = 0.5;

	/**
	 * Height of the stage in pixels. Confetti will only fall within this height.
	 *
	 * @default 800
	 *
	 * @example
	 *
	 * ```svelte
	 * <ConfettiExplosion stageHeight={500} />
	 * ```
	 */
	export let stageHeight = 500;

	/**
	 * Width of the stage in pixels. Confetti will only fall within this width.
	 *
	 * @default 1600
	 *
	 * @example
	 *
	 * ```svelte
	 * <ConfettiExplosion stageWidth={1000} />
	 * ```
	 */
	export let stageWidth = 1600;

	/**
	 * Whether or not destroy all confetti nodes after the `duration` period has passed. By default it destroys all nodes, to preserve memory.
	 *
	 * @default true
	 *
	 * @example
	 *
	 * ```svelte
	 * <ConfettiExplosion shouldDestroyAfterDone={false} />
	 * ```
	 */
	export let shouldDestroyAfterDone = true;

	let isVisible = true;

	$: particles = createParticles(particleCount, colors);

	$: isValid = validate(
		particleCount,
		duration,
		colors,
		particleSize,
		force,
		stageHeight,
		stageWidth,
		particlesShape
	);

	onMount(() => {
		let timeoutId = setTimeout(() => shouldDestroyAfterDone && (isVisible = false), duration);
		return () => clearTimeout(timeoutId);
	});

	function confettiStyles(node: HTMLDivElement, degree: number) {
		// Crazy calculations for generating styles
		const rotationTransform = mathRound(random() * (POSSIBLE_ROTATION_TRANSFORMS - 1));
		const isCircle =
			particlesShape !== 'rectangles' &&
			(particlesShape === 'circles' || shouldBeCircle(rotationTransform));

		const setCSSVar = (key: string, val: string | number | string[]) =>
			node.style.setProperty(key, val + '');

		// Get x landing point for it
		setCSSVar(
			'--x-landing-point',
			mapRange(abs(rotate(degree, 90) - 180), 0, 180, -stageWidth / 2, stageWidth / 2) + 'px'
		);
		setCSSVar('--duration-chaos', duration - mathRound(random() * 1e3) + 'ms');

		// x-axis disturbance, roughly the distance the particle will initially deviate from its target
		const x1 =
			random() < CRAZY_PARTICLES_FREQUENCY ? round(random() * CRAZY_PARTICLE_CRAZINESS, 2) : 0;
		setCSSVar('--x1', x1);
		setCSSVar('--x2', x1 * -1);
		setCSSVar('--x3', x1);
		// x-axis arc of explosion, so 90deg and 270deg particles have curve of 1, 0deg and 180deg have 0
		setCSSVar('--x4', round(abs(mapRange(abs(rotate(degree, 90) - 180), 0, 180, -1, 1)), 4));

		// roughly how fast particle reaches end of its explosion curve
		setCSSVar('--y1', round(random() * BEZIER_MEDIAN, 4));
		// roughly maps to the distance particle goes before reaching free-fall
		setCSSVar('--y2', round(random() * force * (coinFlip() ? 1 : -1), 4));
		// roughly how soon the particle transitions from explosion to free-fall
		setCSSVar('--y3', BEZIER_MEDIAN);
		// roughly the ease of free-fall
		setCSSVar('--y4', round(max(mapRange(abs(degree - 180), 0, 180, force, -force), 0), 4));

		// set --width and --height here
		setCSSVar(
			'--width',
			(isCircle ? particleSize : mathRound(random() * 4) + particleSize / 2) + 'px'
		);
		setCSSVar(
			'--height',
			(isCircle ? particleSize : mathRound(random() * 2) + particleSize) + 'px'
		);

		setCSSVar('--rotation', rotationTransform.toString(2).padStart(3, '0').split(''));
		setCSSVar(
			'--rotation-duration',
			random() * (ROTATION_SPEED_MAX - ROTATION_SPEED_MIN) + ROTATION_SPEED_MIN + 'ms'
		);
		setCSSVar('--border-radius', isCircle ? '50%' : 0);
	}
</script>

{#if isVisible && isValid}
	<div class="container" style:--stage-height="{stageHeight}px">
		{#each particles as { color, degree }}
			<div class="particle" use:confettiStyles={degree}>
				<div style:--bgcolor={color} />
			</div>
		{/each}
	</div>
{/if}

<style lang="scss">
	@keyframes y-axis {
		to {
			transform: translate3d(0, var(--stage-height), 0);
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

		transform: translate3d(var(--x, 0), var(--y, 0), 0);

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
