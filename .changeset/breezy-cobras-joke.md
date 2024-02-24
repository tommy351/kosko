---
"@kosko/generate": minor
---

Add `validateAllManifests` option to `generate` function. You can use this option to run a custom validation function for all manifests. This function will be called after all manifests are resolved.

```ts
generate(values, {
  validateAllManifests(manifests) {
    for (const manifest of manifests) {
      if (!manifest.metadata.namespace) {
        manifest.report({
          severity: "error",
          message: "Namespace is required"
        });
      }
    }
  }
});
```
