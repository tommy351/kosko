---
"@kosko/kustomize": major
"@kosko/migrate": major
"@kosko/helm": major
---

`@kosko/yaml` is a peer dependency now. It means users must install `@kosko/yaml` alongside this package manually. This change should prevent duplicated `@kosko/yaml` instances.
