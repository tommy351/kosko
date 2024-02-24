---
"@kosko/generate": major
---

Add `throwOnError` option to `generate` and `resolve` function. This is a breaking change because errors are not thrown by default anymore. You can either fetch errors from the `issues` array of the result, or set the `throwOnError` option to `true`.
