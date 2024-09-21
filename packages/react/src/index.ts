'use client';

import { confetti, type ConfettiOptions, type ConfettiParticleShape } from '@neoconfetti/core';
import { createElement, useEffect, useRef } from 'react';

interface ConfettiProps extends ConfettiOptions {
	class?: string;
}

export function Confetti({ class: className, ...options }: ConfettiProps) {
	const target_ref = useRef<HTMLElement>(null);
	const instance_ref = useRef<ReturnType<typeof confetti>>();

	useEffect(() => {
		if (typeof window === 'undefined') return;
		if (!target_ref.current) return;

		if (!instance_ref.current) {
			instance_ref.current = confetti(target_ref.current, options);
			return;
		}

		instance_ref.current.update(options);

		return instance_ref.current.destroy;
	}, [options]);

	return createElement('div', { ref: target_ref, className });
}

export type { ConfettiParticleShape, ConfettiProps };
