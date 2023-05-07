import stylesMap from './style.module.css';
import styles from './style.module.css?inline';

import type { Action } from 'svelte/action';

type ParticleShape = 'mix' | 'circles' | 'rectangles';
type Particle = {
	color: string;
	degree: number;
};
type ConfettiOptions = {
	/**
	 * Number of confetti particles to create
	 *
	 * @default 150
	 */
	particleCount?: number;

	/**
	 * Shape of particles to use. Can be `mix`, `circles` or `rectangles`
	 *
	 * `mix` will use both circles and rectangles
	 * `circles` will use only circles
	 * `rectangles` will use only rectangles
	 *
	 * @default 'mix'
	 */
	particleShape?: ParticleShape;

	/**
	 * Size of the confetti particles in pixels
	 *
	 * @default 12
	 */
	particleSize?: number;

	/**
	 * Duration of the animation in milliseconds
	 *
	 * @default 3500
	 */
	duration?: number;

	/**
	 * Colors to use for the confetti particles. Pass string array of colors. Can use hex colors, named colors,
	 * CSS Variables, literally anything valid in plain CSS.
	 *
	 * @default ['#FFC700', '#FF0000', '#2E3191', '#41BBC7']
	 */
	colors?: string[];

	/**
	 * Force of the confetti particles. Between 0 and 1. 0 is no force, 1 is maximum force.
	 *
	 * @default 0.5
	 */
	force?: number;

	/**
	 * Height of the stage in pixels. Confetti will only fall within this height.
	 *
	 * @default 800
	 */

	stageHeight?: number;

	/**
	 * Width of the stage in pixels. Confetti will only fall within this width.
	 *
	 * @default 1600
	 */
	stageWidth?: number;

	/**
	 * Whether or not destroy all confetti nodes after the `duration` period has passed. By default it destroys all nodes, to preserve memory.
	 *
	 * @default true
	 */
	destroyAfterDone?: boolean;
};

export const confetti: Action<HTMLElement, ConfettiOptions> = (
	node: HTMLElement,
	options: ConfettiOptions = {}
) => {
	validate(options);

	let {
		colors = ['#FFC700', '#FF0000', '#2E3191', '#41BBC7'],
		duration = 3500,
		force = 0.5,
		particleCount = 150,
		particleShape = 'mix',
		particleSize = 12,
		destroyAfterDone = true,
		stageHeight = 800,
		stageWidth = 1600,
	} = options;

	appendStyles(styles);
	node.classList.add(stylesMap.container);
	node.style.setProperty('--stage-height', stageHeight + 'px');

	let particles = createParticles(particleCount, colors);
	let nodes = createParticleNodes(node, particles);

	function confettiStyles(node: HTMLElement, degree: number) {
		// Crazy calculations for generating styles
		const rotationTransform = mathRound(random() * (POSSIBLE_ROTATION_TRANSFORMS - 1));
		const isCircle =
			particleShape !== 'rectangles' &&
			(particleShape === 'circles' || shouldBeCircle(rotationTransform));

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

		const rotation = rotationTransform.toString(2).padStart(3, '0').split('');
		setCSSVar(
			'--half-rotation',
			rotation.map((n) => +n / 2 + '')
		);
		setCSSVar('--rotation', rotation);
		setCSSVar(
			'--rotation-duration',
			round(random() * (ROTATION_SPEED_MAX - ROTATION_SPEED_MIN) + ROTATION_SPEED_MIN) + 'ms'
		);
		setCSSVar('--border-radius', isCircle ? '50%' : 0);
	}

	for (const [i, node] of Object.entries(nodes)) confettiStyles(node, particles[+i].degree);

	let timer: ReturnType<typeof setTimeout>;
	Promise.resolve().then(
		() => (timer = setTimeout(() => destroyAfterDone && (node.innerHTML = ''), duration))
	);

	return {
		update(newOptions: ConfettiOptions) {
			validate(newOptions);

			const newParticleCount = newOptions.particleCount ?? particleCount;
			const newColors = newOptions.colors ?? colors;
			const newStageHeight = newOptions.stageHeight ?? stageHeight;

			particles = createParticles(newParticleCount, newColors);

			// Other might have changed. First, check the diff for colors, as only that matters
			if (
				newParticleCount === particleCount &&
				JSON.stringify(colors) !== JSON.stringify(newColors)
			)
				// In this, case only update the particles' colors, on every DOM element
				for (const [i, { color }] of Object.entries(particles))
					nodes[+i].style.setProperty('--bgcolor', color);

			if (newParticleCount !== particleCount) {
				// Recreate all particles
				// Delete existing ones
				node.innerHTML = '';

				// Now create new particles
				nodes = createParticleNodes(node, particles);
			}

			// Dont destroy component if destroyAfterDone is false now
			if (destroyAfterDone && !newOptions.destroyAfterDone) clearTimeout(timer);

			// Update stageHeight
			node.style.setProperty('--stage-height', newStageHeight + 'px');

			colors = newColors;
			duration = newOptions.duration ?? duration;
			force = newOptions.force ?? force;
			particleCount = newParticleCount;
			particleShape = newOptions.particleShape ?? particleShape;
			particleSize = newOptions.particleSize ?? particleSize;
			destroyAfterDone = newOptions.destroyAfterDone ?? destroyAfterDone;
			stageHeight = newStageHeight;
			stageWidth = newOptions.stageWidth ?? stageWidth;
		},

		destroy() {
			clearTimeout(timer);
		},
	};
};

function appendStyles(styles: string) {
	const style = element('style');
	style.dataset.neoconfetti = '';
	style.textContent = styles;
	appendChild(document.head, style);
}

function createParticleNodes(node: HTMLElement, particles: Particle[] = []) {
	const particleNodes: HTMLElement[] = [];

	for (const { color } of particles) {
		const particleNode = element('div');
		particleNode.className = stylesMap.particle;
		particleNode.style.setProperty('--bgcolor', color);

		const innerParticle = element('div');

		appendChild(particleNode, innerParticle);

		appendChild(node, particleNode);
		particleNodes.push(particleNode);
	}

	return particleNodes;
}

const ROTATION_SPEED_MIN = 200; // minimum possible duration of single particle full rotation
const ROTATION_SPEED_MAX = 800; // maximum possible duration of single particle full rotation
const CRAZY_PARTICLES_FREQUENCY = 0.1; // 0-1 frequency of crazy curvy unpredictable particles
const CRAZY_PARTICLE_CRAZINESS = 0.3; // 0-1 how crazy these crazy particles are
const BEZIER_MEDIAN = 0.5; // utility for mid-point bezier curves, to ensure smooth motion paths

const abs = Math.abs,
	random = Math.random,
	mathRound = Math.round,
	max = Math.max;

const element = <K extends keyof HTMLElementTagNameMap>(name: K) => document.createElement(name);
const appendChild = (parent: HTMLElement, child: HTMLElement) => parent.appendChild(child);

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

const assertPositiveInteger = (val: any, name: string) => {
	if (!isUndefined(val) && Number.isSafeInteger(val) && val < 0)
		throw new Error(name + ' must be a positive integer');
};

const validate = ({
	particleCount,
	duration,
	colors,
	particleSize,
	force,
	stageHeight,
	stageWidth,
	particleShape,
}: ConfettiOptions) => {
	assertPositiveInteger(particleCount, 'particleCount');
	assertPositiveInteger(duration, 'duration');
	assertPositiveInteger(particleSize, 'particleSize');
	assertPositiveInteger(force, 'force');
	assertPositiveInteger(stageHeight, 'stageHeight');
	assertPositiveInteger(stageWidth, 'stageWidth');

	if (!isUndefined(particleShape) && !/^(mix|circles|rectangles)$/i.test(particleShape!))
		throw new Error('particlesShape should be either "mix" or "circles" or "rectangle"');

	if (!isUndefined(colors) && !Array.isArray(colors))
		throw new Error('colors must be an array of strings');

	if (force! > 1) throw new Error('force must be within 0 and 1');
};

export type { ParticleShape as ConfettiParticleShape, ConfettiOptions };
