import { type Directive } from 'vue';
import { confetti, type ConfettiOptions } from '@neoconfetti/core';

const confetti_map = new WeakMap<HTMLElement, ReturnType<typeof confetti>>();

export const vConfetti: Directive<HTMLElement, ConfettiOptions | undefined> = {
	mounted: (el, { value = {} }) =>
		!confetti_map.has(el) && confetti_map.set(el, confetti(el, value)),

	updated: (el, { value = {} }) => confetti_map.get(el)!.update(value),

	unmounted: (el) => {
		confetti_map.get(el)!.destroy();
		confetti_map.delete(el);
	},
};

export type { ConfettiOptions, ConfettiParticleShape } from '@neoconfetti/core';
