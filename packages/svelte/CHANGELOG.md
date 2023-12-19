# @neoconfetti/svelte

## 2.1.0

### Minor Changes

- 01a3b51: Fixes, setting any option to undefined reverts it to default value, more fine grained reactivity. If the particlesCount doesn't change, confetti isn't recreated.

## 2.0.0

### Major Changes

- a933eb4: - Remove runtime validation. Rely on TypeScript's checking
  - BREAKING: Use `translate` and `rotate` CSS properties instead of transform.
  - Size reduction of 300bytes. Now 1.36kb min_brotli
  - By defauly ships unminified build. To use minified build, use dist/min/index.js
