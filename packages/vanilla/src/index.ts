import {
	DEFAULT_DURATION,
	confetti,
	type ConfettiOptions,
	type ConfettiParticleShape,
} from '@neoconfetti/core';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class Confetti {
	#node: HTMLElement;
	#options: ConfettiOptions = {};

	#instance?: ReturnType<typeof confetti>;

	/**
	 * Initialize Confetti. Doesn't explode until you call `explode()`
	 */
	constructor(node: HTMLElement, options: ConfettiOptions = {}) {
		this.#node = node;
		this.options = options; // Use the setter to initialize options
	}

	/**
	 * Options Proxy Creator
	 */
	#create_proxy = (options: ConfettiOptions) => {
		return new Proxy(options, {
			set: (target, property, value) => {
				Reflect.set(target, property, value);
				this.#instance?.update(this.#options); // Update confetti instance when options change
				return true;
			},
		});
	};

	/**
	 * options passed to confetti instance
	 */
	get options() {
		return JSON.parse(JSON.stringify(this.#options));
	}

	set options(value: ConfettiOptions) {
		this.#options = this.#create_proxy(value); // Initialize options with a proxy
		this.#instance?.update(this.#options); // Update confetti instance on setting new options
	}

	/**
	 * Explode confetti.
	 * @returns Promise that resolves after confetti duration
	 *
	 * @example
	 *
	 * ```ts
	 * const confetti = new Confetti(targetEl);
	 *
	 * console.time('confetti')
	 * await confetti.explode();
	 * console.time('confetti') // Will log ~3500ms
	 * ```
	 */
	async explode() {
		this.#instance = confetti(this.#node, this.#options);
		return sleep(this.#options.duration ?? DEFAULT_DURATION);
	}

	/**
	 * Destroy confetti instance
	 */
	destroy() {
		this.#instance?.destroy();
	}
}

export type { ConfettiOptions, ConfettiParticleShape };
