# @neoconfetti/svelte

Let's party 🎊🎊 with Svelte! `@neoconfetti/svelte` allows you to show an awesome confetti explosion on your page, with Svelte!

> This library is the port of the amazing [react-confetti-explosion](https://www.npmjs.com/package//react-confetti-explosion) package. All the logic is from that package only, optimisation and Svelte code are mine 😉

## Features

- 🤏 Tiny - 1.66KB min+br.
- 🐇 Simple - Quite simple to use, and effectively no-config required!
- 🧙‍♀️ Elegant - Svelte action `use:confetti` rather than setting things up in `onMount` hook.
- 🗃️ Customizable - Offers tons of options that you can modify to get different behaviors.
- 🖥️ SSR friendly - Works seamlessly in Sveltekit and other Server Side Rendering environments!

[Try it in Svelte REPL](https://svelte.dev/repl/4e41a080739a4427a1f2c98b7f5d4b24)

## Installing

```bash
# pnpm
pnpm add @neoconfetti/svelte

# npm
npm install @neoconfetti/svelte

# yarn
yarn add @neoconfetti/svelte
```

## Usage

Basic usage:

```svelte
<script>
	import { confetti } from '@neoconfetti/svelte';
</script>

<div use:confetti />
```

Customizing behavior with options:

```svelte
<div use:confetti={{ particleCount: 200, force: 0.3 }} />
```

## Props

There's tons of options available for this package. All of them are already documented within the code itself, so you'll never have to leave the code editor.

### particleCount

Number of confetti particles to create.

**type:** `number`

**Default value:** 150

**Example:**

```svelte
<div use:confetti={{ particleCount: 200 }} />
```

### particleSize

Size of the confetti particles in pixels

**type:** `number`

**Default value:** 12

**Example:**

```svelte
<div use:confetti={{ particleSize:20 }} />
```

### particleShape

Shape of particles to use. Can be `mix`, `circles` or `rectangles`

`mix` will use both circles and rectangles
`circles` will use only circles
`rectangles` will use only rectangles

**type:** `'mix' | 'circles' | 'rectangles'`

**Default value:** `'mix'`

**Example:**

```svelte
<div use:confetti={{ particleShape: 'circles' }} />
```

### duration

Duration of the animation in milliseconds

**type:** `number`

**Default value:** 3500

**Example:**

```svelte
<div use:confetti={{ duration: 5000 }} />
```

### colors

Colors to use for the confetti particles. Pass string array of colors. Can use hex colors, named colors, CSS Variables, literally anything valid in plain CSS.

**type:** `Array<string>`

**Default value:** `['#FFC700', '#FF0000', '#2E3191', '#41BBC7']`

**Example:**

```svelte
<div use:confetti={{ colors: ['var(--yellow)', 'var(--red)', '#2E3191', '#41BBC7'] }} />
```

### force

Force of the confetti particles. Between 0 and 1. 0 is no force, 1 is maximum force. Will error out if you pass a value outside of this range.

**type:** `number`

**Default value:** 0.5

**Example:**

```svelte
<div use:confetti={{ force: 0.3 }} />
```

### stageHeight

Height of the stage in pixels. Confetti will only fall within this height.

**type:** `number`

**Default value:** 800

**Example:**

```svelte
<div use:confetti={{ stageHeight: 500 }} />
```

### stageWidth

Width of the stage in pixels. Confetti will only fall within this width.

**type:** `number`

**Default value:** 1600

**Example:**

```svelte
<div use:confetti={{ stageWidth: 500 }} />
```

### shouldDestroyAfterDone

Whether or not destroy all confetti nodes after the `duration` period has passed. By default it destroys all nodes, to free up memory.

**type:** `boolean`

**Default value:** `true`

**Example:**

```svelte
<div use:confetti={{ destroyAfterDone: false }} />
```

## Examples

[Basic Example](https://svelte.dev/repl/4e41a080739a4427a1f2c98b7f5d4b24?version=3.50.1)

[Confetti where mouse click](https://svelte.dev/repl/dbe0ab06c34f4f25aa6f948fdd1982c7?version=3.50.1)

## Performance

This library functions by creating 2 DOM nodes for every single confetti. By default, if the `particlesCount` is set to 150, it will create 300 nodes. This is a lot of nodes. For most devices, these many nodes are not a big issue, but I recommend checking your target devices' performance if you choose to go with a higher number, like 400 or 500.

Also, after the specified `duration`, all the confetti DOM nodes will be destroyed. This is to free up memory. If you wish to keep them around, set `destroyAfterDone` to `false`.

## License

MIT License
© [Puru Vijay](https://twitter.com/puruvjdev)
