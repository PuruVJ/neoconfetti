import { confetti, type ConfettiOptions, type ConfettiParticleShape } from '@neoconfetti/core';

const camel_to_kebab = (str: string) =>
	str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

const is_nullish = (value: any): value is null | undefined => value === null || value === undefined;

function normalize_attributes(attributes: NamedNodeMap) {
	const numbers = [
		'duration',
		'force',
		'particleCount',
		'particleSize',
		'stageHeight',
		'stageWidth',
	] as const;
	const arrays = ['colors'] as const;
	const booleans = ['destroyAfterDone'] as const;
	const strings = ['particleClass', 'particleShape'] as const;
	const options: ConfettiOptions = {};

	const attr = (name: string) => attributes.getNamedItem(camel_to_kebab(name))?.value;

	for (const num of numbers) {
		const value = attr(num);
		if (!is_nullish(value)) {
			options[num] = +value;
		}
	}

	for (const array of arrays) {
		const value = attr(array);
		if (!is_nullish(value) && value !== '') {
			options[array] = value.split(',');
		}
	}

	for (const boolean of booleans) {
		const value = attr(boolean);
		if (!is_nullish(value)) {
			options[boolean] = value === 'true';
		}
	}

	for (const str of strings) {
		const value = attr(str);
		if (!is_nullish(value)) {
			options[str] = value as any;
		}
	}

	return options;
}

type ConfettiAttributes = {
	colors?: ConfettiOptions['colors'];
	'destroy-after-done'?: ConfettiOptions['destroyAfterDone'];
	duration?: ConfettiOptions['duration'];
	force?: ConfettiOptions['force'];
	'particle-class'?: ConfettiOptions['particleClass'];
	'particle-count'?: ConfettiOptions['particleCount'];
	'particle-shape'?: ConfettiOptions['particleShape'];
	'particle-size'?: ConfettiOptions['particleSize'];
	'stage-height'?: ConfettiOptions['stageHeight'];
	'stage-width'?: ConfettiOptions['stageWidth'];
};

export class InternalConfetti extends HTMLElement {
	#instance?: ReturnType<typeof confetti>;

	static observedAttributes: (keyof ConfettiAttributes)[] = [
		'colors',
		'destroy-after-done',
		'duration',
		'force',
		'particle-class',
		'particle-count',
		'particle-shape',
		'particle-size',
		'stage-height',
		'stage-width',
	];

	constructor() {
		super();
	}

	connectedCallback() {
		const root = this.attachShadow({ mode: 'open' });
		const div = document.createElement('div');
		root.appendChild(div);

		this.#instance = confetti(div, normalize_attributes(this.attributes));
	}

	attributeChangedCallback() {
		this.#instance?.update(normalize_attributes(this.attributes));
	}

	disconnectedCallback() {
		this.#instance?.destroy();
	}
}

type HTMLNeoConfettiElement = { new (): InternalConfetti & ConfettiAttributes };
export type { ConfettiOptions, ConfettiParticleShape, HTMLNeoConfettiElement };

customElements.define('neo-confetti', InternalConfetti);
