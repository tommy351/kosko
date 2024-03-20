---
"@kosko/generate": minor
---

Add `validateManifest` option to `generate` and `resolve` function. You can use this option to run a custom validation function for each manifest. This function will be called after the `transform` function and the `validate` method of a manifest.

The following example shows how to use this option to validate that a manifest has a namespace.

```ts
resolve(values, {
  validateManifest(manifest) {
    if (!manifest.metadata.namespace) {
      manifest.report({
        severity: "error",
        message: "Namespace is required"
      });
    }
  }
});
```
