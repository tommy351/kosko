---
"@kosko/generate": minor
---

Add `validateManifest` option to `generate` and `resolve` function. You can use this option to run a custom validation function for each manifest. This function will be called after the `transform` function and the `validate` method of a manifest.

```ts
resolve(values, {
  validateManifest(manifest) {
    manifest.report({
      severity: "error",
      message: "This is an error message"
    });
  }
});
```
