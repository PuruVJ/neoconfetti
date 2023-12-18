import { confetti, type ConfettiOptions, type ConfettiParticleShape } from '@neoconfetti/core';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class Confetti {
	#node: HTMLElement;
	#options: ConfettiOptions = {};

	#instance?: ReturnType<typeof confetti>;

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
				this.#update_confetti(); // Update confetti instance when options change
				return true;
			},
		});
	};

	/** Update Confetti */
	#update_confetti = () => {
		if (this.#instance) {
			this.#instance.update(this.#options);
		}
	};

	get options() {
		return this.#options;
	}

	set options(value: ConfettiOptions) {
		this.#options = this.#create_proxy(value); // Initialize options with a proxy
		this.#update_confetti(); // Update confetti instance on setting new options
	}

	async explode() {
		this.#instance = confetti(this.#node, this.#options);
		return sleep(this.#options.duration ?? 3500);
	}

	destroy() {
		this.#instance?.destroy();
	}
}

export type { ConfettiOptions, ConfettiParticleShape };
