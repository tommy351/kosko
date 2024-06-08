# @kosko/helm

## 5.1.0

### Minor Changes

- [#135](https://github.com/tommy351/kosko/pull/135) [`95780a9`](https://github.com/tommy351/kosko/commit/95780a975e72a7feebc03ec7ea0248c8246f4151) Thanks [@tommy351](https://github.com/tommy351)! - Add options: `insecureSkipTlsVerify`, `passCredentials`, `isUpgrade`, `kubeVersion`, `postRenderer`, `postRendererArgs`.

- [#135](https://github.com/tommy351/kosko/pull/135) [`040af63`](https://github.com/tommy351/kosko/commit/040af63d46358c60d56ef823433b97af012090a0) Thanks [@tommy351](https://github.com/tommy351)! - Implement Helm chart cache. Cache is enabled by default. You can disable it by setting `cache.enabled` to `false`.

## 5.0.0

### Major Changes

- [#141](https://github.com/tommy351/kosko/pull/141) [`3485f8a`](https://github.com/tommy351/kosko/commit/3485f8a92129a3b300fae026ea41a9701e523c5f) Thanks [@tommy351](https://github.com/tommy351)! - Support the following YAML 1.1 features to match the behavior of [sigs.k8s.io/yaml](https://pkg.go.dev/sigs.k8s.io/yaml).

  - Numbers starting with `0` (e.g. `0777`) are interpreted as octal numbers, instead of decimal numbers.
  - YAML 1.2 octal number `0o` prefix is still supported.
  - YAML 1.1 booleans (`yes`, `no`, `on`, `off`, `y`, `n`) are interpreted as booleans, instead of strings.

### Patch Changes

- Updated dependencies [[`3485f8a`](https://github.com/tommy351/kosko/commit/3485f8a92129a3b300fae026ea41a9701e523c5f)]:
  - @kosko/yaml@5.0.0

## 4.0.2

### Patch Changes

- [`c98b372`](https://github.com/tommy351/kosko/commit/c98b372430983a66c4a78e9358ac26c2cd342718) Thanks [@tommy351](https://github.com/tommy351)! - Remove `.d.mts` files because their contents are as same as `.d.ts` files.

- Updated dependencies [[`c98b372`](https://github.com/tommy351/kosko/commit/c98b372430983a66c4a78e9358ac26c2cd342718)]:
  - @kosko/common-utils@1.1.1
  - @kosko/exec-utils@2.0.1
  - @kosko/yaml@4.0.2

## 4.0.1

### Patch Changes

- Updated dependencies [[`e904ce3`](https://github.com/tommy351/kosko/commit/e904ce313295d4737ed9bf0d711c26c53f63fd88), [`e904ce3`](https://github.com/tommy351/kosko/commit/e904ce313295d4737ed9bf0d711c26c53f63fd88)]:
  - @kosko/common-utils@1.1.0
  - @kosko/yaml@4.0.1

## 4.0.0

### Major Changes

- [#130](https://github.com/tommy351/kosko/pull/130) [`e10f038`](https://github.com/tommy351/kosko/commit/e10f0389d2e80574f03b7827f683e68c1f83e333) Thanks [@tommy351](https://github.com/tommy351)! - `@kosko/yaml` is a peer dependency now. It means users must install `@kosko/yaml` alongside this package manually. This change should prevent duplicated `@kosko/yaml` instances.

- [#129](https://github.com/tommy351/kosko/pull/129) [`d627995`](https://github.com/tommy351/kosko/commit/d62799577863ec561978a1ce430be38e0c5dbb9d) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 14. The minimum supported Node.js version is 18 now.

### Patch Changes

- Updated dependencies [[`d627995`](https://github.com/tommy351/kosko/commit/d62799577863ec561978a1ce430be38e0c5dbb9d)]:
  - @kosko/common-utils@1.0.0
  - @kosko/exec-utils@2.0.0
  - @kosko/yaml@4.0.0

## 3.1.2

### Patch Changes

- Updated dependencies [[`782a9d3`](https://github.com/tommy351/kosko/commit/782a9d3b79529d04c8a01addc6ef9fb59df8a545)]:
  - @kosko/yaml@3.3.0

## 3.1.1

### Patch Changes

- Updated dependencies [[`ef5e8c0`](https://github.com/tommy351/kosko/commit/ef5e8c00f6a430bb6bad2e55e286d36ee26ad18f)]:
  - @kosko/yaml@3.2.1

## 3.1.0

### Minor Changes

- [#118](https://github.com/tommy351/kosko/pull/118) [`9923210`](https://github.com/tommy351/kosko/commit/9923210d7cb465c787966dc55e7755619a921552) Thanks [@tommy351](https://github.com/tommy351)! - Build bundles with Rollup.

- [`69729f8`](https://github.com/tommy351/kosko/commit/69729f869caa8f89c88ff29b8675467e0826000d) Thanks [@tommy351](https://github.com/tommy351)! - Support TypeScript `nodenext` module resolution.

### Patch Changes

- Updated dependencies [[`9923210`](https://github.com/tommy351/kosko/commit/9923210d7cb465c787966dc55e7755619a921552), [`8f4d82f`](https://github.com/tommy351/kosko/commit/8f4d82f1ceab3f246414f0527ca02f97ae6bd292), [`69729f8`](https://github.com/tommy351/kosko/commit/69729f869caa8f89c88ff29b8675467e0826000d)]:
  - @kosko/common-utils@0.2.0
  - @kosko/exec-utils@1.1.0
  - @kosko/yaml@3.2.0

## 3.0.1

### Patch Changes

- [#114](https://github.com/tommy351/kosko/pull/114) [`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7) Thanks [@tommy351](https://github.com/tommy351)! - Update docs.

- Updated dependencies [[`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7), [`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7)]:
  - @kosko/common-utils@0.1.1
  - @kosko/exec-utils@1.0.1
  - @kosko/yaml@3.1.0

## 3.0.0

### Major Changes

- [#104](https://github.com/tommy351/kosko/pull/104) [`fef43bb`](https://github.com/tommy351/kosko/commit/fef43bbde55c5c2c48b0a81c71014513e83a7ad2) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 12. The minimum supported Node.js version is 14.18.0 now.

### Minor Changes

- [#108](https://github.com/tommy351/kosko/pull/108) [`affd063`](https://github.com/tommy351/kosko/commit/affd0632bc31033864cbc49620bee870d46437c8) Thanks [@tommy351](https://github.com/tommy351)! - Remove `readonly` attribute from return values.

- [#110](https://github.com/tommy351/kosko/pull/110) [`dec5a64`](https://github.com/tommy351/kosko/commit/dec5a64feb8486a2e772f533c9cb2a20c43e7151) Thanks [@tommy351](https://github.com/tommy351)! - Better error message for spawn ENOENT errors.

### Patch Changes

- Updated dependencies [[`4c34f5d`](https://github.com/tommy351/kosko/commit/4c34f5d1752eec320885ad479daeed7beab10c4a), [`fef43bb`](https://github.com/tommy351/kosko/commit/fef43bbde55c5c2c48b0a81c71014513e83a7ad2), [`dc6dfd5`](https://github.com/tommy351/kosko/commit/dc6dfd5918e57e2a0368333b1ced8190dfd801ee), [`affd063`](https://github.com/tommy351/kosko/commit/affd0632bc31033864cbc49620bee870d46437c8), [`4aff238`](https://github.com/tommy351/kosko/commit/4aff2388449a9887ca417db97296a6843854140b)]:
  - @kosko/exec-utils@1.0.0
  - @kosko/yaml@3.0.0
  - @kosko/common-utils@0.1.0

## 2.0.3

### Patch Changes

- Updated dependencies [[`9f16569`](https://github.com/tommy351/kosko/commit/9f165696ffc1274ee28386b5bac979373fbce68b)]:
  - @kosko/exec-utils@0.2.0

## 2.0.2

### Patch Changes

- Updated dependencies []:
  - @kosko/yaml@2.0.1

## 2.0.1

### Patch Changes

- [#90](https://github.com/tommy351/kosko/pull/90) [`5b71844`](https://github.com/tommy351/kosko/commit/5b71844e700fdec9225c6c1395004a12e0869254) Thanks [@tommy351](https://github.com/tommy351)! - Shared utility functions are moved to `@kosko/exec-utils` package.

- Updated dependencies [[`5b71844`](https://github.com/tommy351/kosko/commit/5b71844e700fdec9225c6c1395004a12e0869254)]:
  - @kosko/exec-utils@0.1.0

## 2.0.0

### Major Changes

- [#88](https://github.com/tommy351/kosko/pull/88) [`fe85506`](https://github.com/tommy351/kosko/commit/fe8550688d7fe53f006bb64b8dd925348facef04) Thanks [@tommy351](https://github.com/tommy351)! - Drop support of Node.js 10. The minimum supported version is Node.js 12 now.

### Patch Changes

- Updated dependencies [[`fe85506`](https://github.com/tommy351/kosko/commit/fe8550688d7fe53f006bb64b8dd925348facef04)]:
  - @kosko/yaml@2.0.0

## 1.0.0

### Major Changes

- [#86](https://github.com/tommy351/kosko/pull/86) [`03761b6`](https://github.com/tommy351/kosko/commit/03761b6789e735de94bb5500f5b6d9e8b4538cdd) Thanks [@tommy351](https://github.com/tommy351)! - Replace `skipCrds` option with `includeCrds` option.

## 0.1.2

### Patch Changes

- Updated dependencies []:
  - @kosko/yaml@1.0.2

## 0.1.1

### Patch Changes

- [#73](https://github.com/tommy351/kosko/pull/73) [`b6183c3`](https://github.com/tommy351/kosko/commit/b6183c3781ab3f1f1d21de8fbd21e5ef0ca37e17) Thanks [@tommy351](https://github.com/tommy351)! - Add `sideEffect: false` to `package.json`.

- Updated dependencies [[`b6183c3`](https://github.com/tommy351/kosko/commit/b6183c3781ab3f1f1d21de8fbd21e5ef0ca37e17)]:
  - @kosko/yaml@1.0.1

## 0.1.0

### Minor Changes

- [#69](https://github.com/tommy351/kosko/pull/69) [`f8d46b8`](https://github.com/tommy351/kosko/commit/f8d46b8c6e21b489bc6b40e14218e7eef21b496f) Thanks [@tommy351](https://github.com/tommy351)! - Implement `loadChart` function.
