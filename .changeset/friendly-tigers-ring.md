---
"@kosko/yaml": minor
---

`node-fetch` is an optional dependency now. Node.js provides global `fetch` API since v18.0.0. You can also provide your own fetch polyfill (e.g. `isomorphic-fetch`, `cross-fetch`) instead. If `global.fetch` is undefined, `node-fetch` will be used automatically.
