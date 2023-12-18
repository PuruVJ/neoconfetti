import { confetti, type ConfettiOptions } from '@neoconfetti/core';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class Confetti {
	#node: HTMLElement;
	#options: ConfettiOptions = {};

	#confetti_instance?: ReturnType<typeof confetti>;
	#is_batch_updating = false;

	constructor(node: HTMLElement, options: ConfettiOptions = {}) {
		this.#node = node;
		this.#options = this.#create_proxy(options);
	}

	#create_proxy(options: ConfettiOptions) {
		return new Proxy(options, {
			set: (target, property: keyof ConfettiOptions, value) => {
				console.log('Proxy');
				target[property] = value;
				if (!this.#is_batch_updating) {
					this.#confetti_instance?.update(this.#options);
				}
				return true;
			},
		});
	}

	async explode() {
		this.#confetti_instance = confetti(this.#node, this.#options);
		return sleep(this.#options.duration ?? 3500);
	}

	set options(newOptions: ConfettiOptions) {
		this.#is_batch_updating = true;
		const merged = { ...this.#options, ...newOptions };

		// Update existing options instead of replacing the object
		for (const key in merged) {
			if (merged.hasOwnProperty(key)) {
				// @ts-ignore
				this.#options[key] = merged[key];
			}
		}

		this.#is_batch_updating = false;
		this.#confetti_instance?.update(this.#options);
	}

	get options() {
		return JSON.parse(JSON.stringify(this.#options));
	}

	destroy() {
		this.#confetti_instance?.destroy();
	}
}

export type { ConfettiOptions, ConfettiParticleShape } from '@neodrag/core';
