# @kosko/plugin-lint

## 0.4.0

### Minor Changes

- [`b5760c5`](https://github.com/tommy351/kosko/commit/b5760c56ae18039ae52d55fd01306f50ff36ef0b) Thanks [@tommy351](https://github.com/tommy351)! - Support `VerticalPodAutoscaler` (VPA), `MultidimPodAutoscaler` (MPA), and [KEDA](https://keda.sh/) in `no-missing-scale-target` rule.

- [`40b7ab7`](https://github.com/tommy351/kosko/commit/40b7ab7691e2e1995f4d2d58fafea31044c9b894) Thanks [@tommy351](https://github.com/tommy351)! - Support disabling lint rules on a specific manifest.

- [`6996f81`](https://github.com/tommy351/kosko/commit/6996f8190ff47e633b5fecb41c00f39bad6aaf66) Thanks [@tommy351](https://github.com/tommy351)! - Add `ban-namespace` rule.

- [`7be3794`](https://github.com/tommy351/kosko/commit/7be3794ccc67ebc54a1f87568fe5cd083f716eeb) Thanks [@tommy351](https://github.com/tommy351)! - Support more secret types in `no-missing-secret` rule.

- [`3f38921`](https://github.com/tommy351/kosko/commit/3f38921fee4a0c5d4baddfdcb61afb5bd746ded3) Thanks [@tommy351](https://github.com/tommy351)! - Allow users to specify keys of `requests` and `limits` that must be defined in container resources in `require-container-resources` rule.

## 0.3.0

### Minor Changes

- [`46870ab`](https://github.com/tommy351/kosko/commit/46870ab0bd137fa4c70d9ee74fee45ed12c1e4a2) Thanks [@tommy351](https://github.com/tommy351)! - Add `no-replicas-with-hpa` rule.

## 0.2.0

### Minor Changes

- [`540cd91`](https://github.com/tommy351/kosko/commit/540cd9102773892d43c874e47269e4251e47db99) Thanks [@tommy351](https://github.com/tommy351)! - Support Argo Rollouts and Knative.

### Patch Changes

- [`c98b372`](https://github.com/tommy351/kosko/commit/c98b372430983a66c4a78e9358ac26c2cd342718) Thanks [@tommy351](https://github.com/tommy351)! - Remove `.d.mts` files because their contents are as same as `.d.ts` files.

- Updated dependencies [[`c98b372`](https://github.com/tommy351/kosko/commit/c98b372430983a66c4a78e9358ac26c2cd342718)]:
  - @kosko/common-utils@1.1.1
  - @kosko/plugin@0.2.1
  - @kosko/require@7.0.1

## 0.1.0

### Minor Changes

- [#133](https://github.com/tommy351/kosko/pull/133) [`cb84d78`](https://github.com/tommy351/kosko/commit/cb84d786f30ef0ef09e9d4b7dfc33b74f7e7cc49) Thanks [@tommy351](https://github.com/tommy351)! - First release.

### Patch Changes

- Updated dependencies [[`51e93b1`](https://github.com/tommy351/kosko/commit/51e93b134a0f1bf4e05e5d7b9684f1e1cf068edb), [`e904ce3`](https://github.com/tommy351/kosko/commit/e904ce313295d4737ed9bf0d711c26c53f63fd88), [`51e93b1`](https://github.com/tommy351/kosko/commit/51e93b134a0f1bf4e05e5d7b9684f1e1cf068edb), [`c6b5645`](https://github.com/tommy351/kosko/commit/c6b5645ad98f9121c555e5749f2c5ca95ba861a2), [`cb84d78`](https://github.com/tommy351/kosko/commit/cb84d786f30ef0ef09e9d4b7dfc33b74f7e7cc49), [`e904ce3`](https://github.com/tommy351/kosko/commit/e904ce313295d4737ed9bf0d711c26c53f63fd88)]:
  - @kosko/require@7.0.0
  - @kosko/common-utils@1.1.0
  - @kosko/plugin@0.2.0
