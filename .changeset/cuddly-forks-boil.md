---
"@kosko/generate": minor
---

File resolution errors are now reported in issues too. This kind of errors includes:

- Unable to resolve individual component paths.
- A component file throws an error.
- TypeScript compilation errors.
- Module import errors.

This could be a breaking change if you expect the `generate` function to throw a `GenerateError` on these cases. You can set the `throwOnError` option to `false` to disable this behavior.
