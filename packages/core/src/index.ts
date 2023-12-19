import styles from './style.module.css?inline';
import { container as c_container, particle as c_particle } from './style.module.css?map';

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

// Take DEFAULT.COLORS, etc anf convert to DEFAULT_COLORS, etc
const DEFAULT_COLORS = ['#FFC700', '#FF0000', '#2E3191', '#41BBC7'];
const DEFAULT_DURATION = 3500;
const DEFAULT_FORCE = 0.5;
const DEFAULT_PARTICLE_COUNT = 150;
const DEFAULT_PARTICLE_SHAPE = 'mix' as ParticleShape;
const DEFAULT_PARTICLE_SIZE = 12;
const DEFAULT_DESTROY_AFTER_DONE = true;
const DEFAULT_STAGE_HEIGHT = 800;
const DEFAULT_STAGE_WIDTH = 1600;

export function confetti(container: HTMLElement, options: ConfettiOptions = {}) {
	let {
		colors = DEFAULT_COLORS,
		duration = DEFAULT_DURATION,
		force = DEFAULT_FORCE,
		particleCount = DEFAULT_PARTICLE_COUNT,
		particleShape = DEFAULT_PARTICLE_SHAPE,
		particleSize = DEFAULT_PARTICLE_SIZE,
		destroyAfterDone = DEFAULT_DESTROY_AFTER_DONE,
		stageHeight = DEFAULT_STAGE_HEIGHT,
		stageWidth = DEFAULT_STAGE_WIDTH,
	} = options;

	append_styles(styles);
	container.classList.add(c_container);
	// stage-height
	container.style.setProperty('--sh', stageHeight + 'px');

	let particles = create_particles(particleCount, colors);
	let nodes = create_particle_nodes(container, particles);

	const calc_rotation_transform = () => math_round(random() * (POSSIBLE_ROTATION_TRANSFORMS - 1));
	const get_is_circle = (particle_shape: ParticleShape, rotation_transform: number) =>
		particle_shape !== 'rectangles' &&
		(particle_shape === 'circles' || should_be_circle(rotation_transform));

	function confetti_styles(node: HTMLElement, degree: number) {
		// Crazy calculations for generating styles
		const rotation_transform = calc_rotation_transform();
		const is_circle = get_is_circle(particleShape, rotation_transform);

		const set_css_var = (key: string, val: string | number | string[]) =>
			node.style.setProperty(key, val + '');

		// Get x landing point for it
		set_css_var(
			// x landing point
			'--xlp',
			map_range(abs(rotate(degree, 90) - 180), 0, 180, -stageWidth / 2, stageWidth / 2) + 'px'
		);
		set_css_var(
			// duration chaos
			'--dc',
			duration - math_round(random() * 1e3) + 'ms'
		);

		// x-axis disturbance, roughly the distance the particle will initially deviate from its target
		const x1 =
			random() < CRAZY_PARTICLES_FREQUENCY ? round(random() * CRAZY_PARTICLE_CRAZINESS, 2) : 0;
		set_css_var('--x1', x1);
		set_css_var('--x2', x1 * -1);
		set_css_var('--x3', x1);
		// x-axis arc of explosion, so 90deg and 270deg particles have curve of 1, 0deg and 180deg have 0
		set_css_var('--x4', round(abs(map_range(abs(rotate(degree, 90) - 180), 0, 180, -1, 1)), 4));

		// roughly how fast particle reaches end of its explosion curve
		set_css_var('--y1', round(random() * BEZIER_MEDIAN, 4));
		// roughly maps to the distance particle goes before reaching free-fall
		set_css_var('--y2', round(random() * force * (coin_flip() ? 1 : -1), 4));
		// roughly how soon the particle transitions from explosion to free-fall
		set_css_var('--y3', BEZIER_MEDIAN);
		// roughly the ease of free-fall
		set_css_var('--y4', round(max(map_range(abs(degree - 180), 0, 180, force, -force), 0), 4));

		// set --width and --height here
		set_css_var(
			// --width
			'--w',
			(is_circle ? particleSize : math_round(random() * 4) + particleSize / 2) + 'px'
		);
		set_css_var(
			// --height
			'--h',
			(is_circle ? particleSize : math_round(random() * 2) + particleSize) + 'px'
		);

		const rotation = rotation_transform.toString(2).padStart(3, '0').split('');
		set_css_var(
			// --half-rotation
			'--hr',
			rotation.map((n) => +n / 2 + '').join(' ')
		);

		set_css_var(
			// --rotation
			'--r',
			rotation.join(' ')
		);
		set_css_var(
			// --rotation-duration
			'--rd',
			round(random() * (ROTATION_SPEED_MAX - ROTATION_SPEED_MIN) + ROTATION_SPEED_MIN) + 'ms'
		);
		set_css_var(
			// --border-radius
			'--br',
			is_circle ? '50%' : 0
		);
	}

	const create_timer = () => {
		const timer = setTimeout(() => {
			if (destroyAfterDone) container.innerHTML = '';
		}, duration);

		return timer;
	};

	let timer: ReturnType<typeof setTimeout>;
	function scratch() {
		container.innerHTML = '';
		clearTimeout(timer);

		let particles = create_particles(particleCount, colors);
		let nodes = create_particle_nodes(container, particles);

		for (const [i, node] of Object.entries(nodes)) confetti_styles(node, particles[+i].degree);

		timer = create_timer();
	}

	scratch();

	return {
		update(new_options: ConfettiOptions) {
			const new_particle_count = new_options.particleCount ?? DEFAULT_PARTICLE_COUNT;
			const new_particle_shape = new_options.particleShape ?? DEFAULT_PARTICLE_SHAPE;
			const new_particle_size = new_options.particleSize ?? DEFAULT_PARTICLE_SIZE;
			const new_colors = new_options.colors ?? DEFAULT_COLORS;
			const new_stage_height = new_options.stageHeight ?? DEFAULT_STAGE_HEIGHT;
			const new_duration = new_options.duration ?? DEFAULT_DURATION;
			const new_force = new_options.force ?? DEFAULT_FORCE;
			const new_stage_width = new_options.stageWidth ?? DEFAULT_STAGE_WIDTH;
			const new_destroy_after_done = new_options.destroyAfterDone ?? DEFAULT_DESTROY_AFTER_DONE;

			particles = create_particles(new_particle_count, new_colors);

			let start_from_scratch = false;
			// Other might have changed. First, check the diff for colors, as only that matters
			if (new_particle_count === particleCount) {
				//! Why the hell this works but directly setting the CSS variables on nodes doesn't??
				nodes = Array.from(container.querySelectorAll(`.${c_particle}`));

				for (const [i, { color }] of Object.entries(particles)) {
					if (JSON.stringify(colors) !== JSON.stringify(new_colors)) {
						nodes[+i].style.setProperty('--bgc', color);
					}

					if (new_particle_shape !== particleShape) {
						nodes[+i].style.setProperty(
							// --border-radius
							'--br',
							get_is_circle(new_particle_shape, calc_rotation_transform()) ? '50%' : '0'
						);
					}
				}
			} else {
				start_from_scratch = true;
			}

			// Dont destroy component if destroyAfterDone is false now
			if (destroyAfterDone && !new_destroy_after_done) {
				clearTimeout(timer);
			}

			// Update stageHeight
			container.style.setProperty('--sh', new_stage_height + 'px');

			duration = new_duration;
			colors = new_colors;
			force = new_force;
			particleCount = new_particle_count;
			particleShape = new_particle_shape;
			particleSize = new_particle_size;
			destroyAfterDone = new_destroy_after_done;
			stageHeight = new_stage_height;
			stageWidth = new_stage_width;

			console.log(1, start_from_scratch);

			if (start_from_scratch) {
				scratch();
			}
		},

		destroy() {
			clearTimeout(timer);
		},
	};
}

function append_styles(styles: string) {
	if (document.querySelector(`style[data-neoconfetti]`)) return;

	const style = element('style');
	style.dataset.neoconfetti = '';
	style.textContent = styles;
	append_child(document.head, style);
}

function create_particle_nodes(container: HTMLElement, particles: Particle[] = []) {
	const particle_nodes: HTMLElement[] = [];

	for (const { color } of particles) {
		const particle_node = element('div');
		particle_node.className = c_particle;
		particle_node.style.setProperty('--bgc', color);

		const inner_particle = element('div');

		append_child(particle_node, inner_particle);

		append_child(container, particle_node);
		particle_nodes.push(particle_node);
	}

	return particle_nodes;
}

const ROTATION_SPEED_MIN = 200; // minimum possible duration of single particle full rotation
const ROTATION_SPEED_MAX = 800; // maximum possible duration of single particle full rotation
const CRAZY_PARTICLES_FREQUENCY = 0.1; // 0-1 frequency of crazy curvy unpredictable particles
const CRAZY_PARTICLE_CRAZINESS = 0.3; // 0-1 how crazy these crazy particles are
const BEZIER_MEDIAN = 0.5; // utility for mid-point bezier curves, to ensure smooth motion paths

const abs = Math.abs,
	random = Math.random,
	math_round = Math.round,
	max = Math.max;

const element = <K extends keyof HTMLElementTagNameMap>(name: K) => document.createElement(name);
const append_child = (parent: HTMLElement, child: HTMLElement) => parent.appendChild(child);

const create_particles = (count: number, colors: string[]) =>
	Array.from({ length: count }, (_, i) => ({
		color: colors[i % colors.length],
		degree: (i * 360) / count,
	}));

// From here: https://stackoverflow.com/a/11832950
const round = (num: number, precision: number = 2) =>
	math_round((num + Number.EPSILON) * 10 ** precision) / 10 ** precision;

const map_range = (value: number, x1: number, y1: number, x2: number, y2: number) =>
	((value - x1) * (y2 - x2)) / (y1 - x1) + x2;

const rotate = (degree: number, amount: number) =>
	degree + amount > 360 ? degree + amount - 360 : degree + amount;

const coin_flip = () => random() > 0.5;

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
const should_be_circle = (rotation_transform: number) => rotation_transform !== 1 && coin_flip();

export type { ConfettiOptions, ParticleShape as ConfettiParticleShape };
