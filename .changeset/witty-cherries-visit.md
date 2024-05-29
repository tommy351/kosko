---
"@kosko/yaml": major
"@kosko/helm": major
"@kosko/kustomize": major
---

Support the following YAML 1.1 features to match the behavior of [sigs.k8s.io/yaml](https://pkg.go.dev/sigs.k8s.io/yaml).

- Numbers starting with `0` (e.g. `0777`) are interpreted as octal numbers, instead of decimal numbers.
- YAML 1.2 octal number `0o` prefix is still supported.
- YAML 1.1 booleans (`yes`, `no`, `on`, `off`, `y`, `n`) are interpreted as booleans, instead of strings.
