import { confetti, type ConfettiOptions, type ConfettiParticleShape } from '@neoconfetti/core';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class Confetti {
	/** Node */
	private _n: HTMLElement;

	/** Options */
	private _o: ConfettiOptions = {};

	/** Instance */
	private _i?: ReturnType<typeof confetti>;

	constructor(node: HTMLElement, options: ConfettiOptions = {}) {
		this._n = node;
		this._o = this.#createProxy(options);

		return new Proxy(this, {
			set: (target, property: 'options', value: ConfettiOptions, receiver) => {
				if (property === 'options') {
					// Update the options and trigger confetti update
					Reflect.set(target, '_options', this.#createProxy(value), receiver);
					target.#updateConfetti();
					return true;
				}
				return Reflect.set(target, property, value, receiver);
			},
			get: (target, property, receiver) => {
				return Reflect.get(target, property, receiver);
			},
		});
	}

	#createProxy = (options: ConfettiOptions) => {
		return new Proxy(options, {
			set: (target, property, value) => {
				Reflect.set(target, property, value);
				this.#updateConfetti();
				return true;
			},
			get: (target, property) => {
				return Reflect.get(target, property);
			},
		});
	};

	#updateConfetti = () => {
		if (this._i) {
			this._i.update(this._o);
		}
	};

	get options() {
		return this._o;
	}

	set options(value: ConfettiOptions) {
		this._o = this.#createProxy(value);
		this.#updateConfetti();
	}

	async explode() {
		this._i = confetti(this._n, this._o);
		return sleep(this._o.duration ?? 3500);
	}

	destroy() {
		this._i?.destroy();
	}
}

export type { ConfettiOptions, ConfettiParticleShape };
