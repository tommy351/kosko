---
"@kosko/yaml": major
---

Add support for ECMAScript modules.

Breaking changes: `loadString`, `getResourceModule` functions return `Promise` now, because `import()` is asynchronous.
