---
"@kosko/kustomize": minor
---

When `kustomize build` is not available, `loadKustomize` will fallback to `kubectl kustomize` command automatically. You can also customize the build command with the `buildCommand` option.
