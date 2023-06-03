---
"@kosko/generate": minor
---

Add `resolveAsync` and `generateAsync` functions. The async function returns a `AsyncIterable` instead of a `Promise`, which allows users to consume manifest and error one by one.
