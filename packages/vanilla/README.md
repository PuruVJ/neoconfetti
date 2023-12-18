# @neoconfetti/vanilla

Let's party 🎊🎊 with JavaScript! `@neoconfetti/vanilla` allows you to show an awesome confetti explosion on your page, with Svelte!

> This library is the port of the amazing [react-confetti-explosion](https://www.npmjs.com/package//react-confetti-explosion) package. All the logic is from that package only, optimisation and Svelte code are mine 😉

## Features

- 🤏 Tiny - 1.66KB min+br.
- 🐇 Simple - Quite simple to use, and effectively no-config required!
- 🧙‍♀️ Elegant - Svelte action `use:confetti` rather than setting things up in `onMount` hook.
- 🗃️ Customizable - Offers tons of options that you can modify to get different behaviors.
- 🖥️ SSR friendly - Works seamlessly in Sveltekit and other Server Side Rendering environments!

[Try it in Svelte REPL](https://svelte.dev/repl/4e41a080739a4427a1f2c98b7f5d4b24)

## Installing

# Installing

```bash
pnpm add @neodrag/vanilla

# npm
npm install @neodrag/vanilla

# yarn
yarn add @neodrag/vanilla
```

# Usage

Basic usage

```tsx
import { Draggable } from '@neodrag/vanilla';

const dragInstance = new Draggable(document.querySelector('#drag'));
```

With options

```tsx
import { Draggable } from '@neodrag/vanilla';

const dragInstance = new Draggable(document.querySelector('#drag'), {
	axis: 'x',
	grid: [10, 10],
});
```

Defining options elsewhere with typescript

```tsx
import { type Draggable } from '@neodrag/vanilla';

const options: DragOptions = {
	axis: 'y',
	bounds: 'parent',
};

const dragInstance = new Draggable(document.querySelector('#drag'), options);
```

Update options:

```ts
import { Draggable } from '@neodrag/vanilla';

const dragInstance = new Draggable(document.querySelector('#drag'), {
	axis: 'x',
	grid: [10, 10],
});

// Update the specific options. Will be merged with the existing options.
dragInstance.update({
	axis: 'y',
});

// Completely overrides existing options, in this case, the `grid` property is removed
dragInstance.options = {
	axis: 'y',
};
```

<a href="https://www.neodrag.dev/docs/vanilla" style="font-size: 2rem">Read the docs</a>

## Credits

Inspired from the amazing [react-draggable](https://github.com/react-grid-layout/react-draggable) library, and implements even more features with a similar API, but 3.7x smaller.

# License

MIT License &copy; Puru Vijay
