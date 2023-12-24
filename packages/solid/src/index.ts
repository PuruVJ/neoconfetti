import { confetti, type ConfettiOptions, type ConfettiParticleShape } from '@neoconfetti/core';
import { createEffect, onCleanup, type Accessor } from 'solid-js';

export const createConfetti = () => ({
	confetti: (node: HTMLElement, options: Accessor<ConfettiOptions>) => {
		const { update, destroy } = confetti(node, options());

		onCleanup(destroy);
		createEffect(() => update(options()));
	},
});

export type { ConfettiOptions, ConfettiParticleShape };
