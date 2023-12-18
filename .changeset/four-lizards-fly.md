---
'@neoconfetti/core': major
---

- Remove runtime validation. Rely on TypeScript's checking
- BREAKING: Use `translate` and `rotate` CSS properties instead of transform.
- Size reduction of 300bytes. Now 1.36kb min_brotli
- By defauly ships unminified build. To use minified build, use dist/min/index.js
