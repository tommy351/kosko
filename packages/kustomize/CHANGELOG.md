# @kosko/kustomize

## 2.0.1

### Patch Changes

- Updated dependencies [[`e904ce3`](https://github.com/tommy351/kosko/commit/e904ce313295d4737ed9bf0d711c26c53f63fd88), [`e904ce3`](https://github.com/tommy351/kosko/commit/e904ce313295d4737ed9bf0d711c26c53f63fd88)]:
  - @kosko/common-utils@1.1.0
  - @kosko/yaml@4.0.1

## 2.0.0

### Major Changes

- [#130](https://github.com/tommy351/kosko/pull/130) [`e10f038`](https://github.com/tommy351/kosko/commit/e10f0389d2e80574f03b7827f683e68c1f83e333) Thanks [@tommy351](https://github.com/tommy351)! - `@kosko/yaml` is a peer dependency now. It means users must install `@kosko/yaml` alongside this package manually. This change should prevent duplicated `@kosko/yaml` instances.

- [#129](https://github.com/tommy351/kosko/pull/129) [`d627995`](https://github.com/tommy351/kosko/commit/d62799577863ec561978a1ce430be38e0c5dbb9d) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 14. The minimum supported Node.js version is 18 now.

### Patch Changes

- Updated dependencies [[`d627995`](https://github.com/tommy351/kosko/commit/d62799577863ec561978a1ce430be38e0c5dbb9d)]:
  - @kosko/common-utils@1.0.0
  - @kosko/exec-utils@2.0.0
  - @kosko/yaml@4.0.0

## 1.1.2

### Patch Changes

- Updated dependencies [[`782a9d3`](https://github.com/tommy351/kosko/commit/782a9d3b79529d04c8a01addc6ef9fb59df8a545)]:
  - @kosko/yaml@3.3.0

## 1.1.1

### Patch Changes

- Updated dependencies [[`ef5e8c0`](https://github.com/tommy351/kosko/commit/ef5e8c00f6a430bb6bad2e55e286d36ee26ad18f)]:
  - @kosko/yaml@3.2.1

## 1.1.0

### Minor Changes

- [#118](https://github.com/tommy351/kosko/pull/118) [`9923210`](https://github.com/tommy351/kosko/commit/9923210d7cb465c787966dc55e7755619a921552) Thanks [@tommy351](https://github.com/tommy351)! - Build bundles with Rollup.

- [`69729f8`](https://github.com/tommy351/kosko/commit/69729f869caa8f89c88ff29b8675467e0826000d) Thanks [@tommy351](https://github.com/tommy351)! - Support TypeScript `nodenext` module resolution.

### Patch Changes

- Updated dependencies [[`9923210`](https://github.com/tommy351/kosko/commit/9923210d7cb465c787966dc55e7755619a921552), [`8f4d82f`](https://github.com/tommy351/kosko/commit/8f4d82f1ceab3f246414f0527ca02f97ae6bd292), [`69729f8`](https://github.com/tommy351/kosko/commit/69729f869caa8f89c88ff29b8675467e0826000d)]:
  - @kosko/common-utils@0.2.0
  - @kosko/exec-utils@1.1.0
  - @kosko/yaml@3.2.0

## 1.0.1

### Patch Changes

- [#114](https://github.com/tommy351/kosko/pull/114) [`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7) Thanks [@tommy351](https://github.com/tommy351)! - Update docs.

- Updated dependencies [[`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7), [`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7)]:
  - @kosko/common-utils@0.1.1
  - @kosko/exec-utils@1.0.1
  - @kosko/yaml@3.1.0

## 1.0.0

### Major Changes

- [#104](https://github.com/tommy351/kosko/pull/104) [`fef43bb`](https://github.com/tommy351/kosko/commit/fef43bbde55c5c2c48b0a81c71014513e83a7ad2) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 12. The minimum supported Node.js version is 14.18.0 now.

### Minor Changes

- [#110](https://github.com/tommy351/kosko/pull/110) [`0c4c068`](https://github.com/tommy351/kosko/commit/0c4c068bd45080e62e336b521739f1244c4c9f36) Thanks [@tommy351](https://github.com/tommy351)! - Store successful command in cache in order to make `loadKustomize` runs faster after the first call.

- [#108](https://github.com/tommy351/kosko/pull/108) [`affd063`](https://github.com/tommy351/kosko/commit/affd0632bc31033864cbc49620bee870d46437c8) Thanks [@tommy351](https://github.com/tommy351)! - Remove `readonly` attribute from return values.

### Patch Changes

- Updated dependencies [[`4c34f5d`](https://github.com/tommy351/kosko/commit/4c34f5d1752eec320885ad479daeed7beab10c4a), [`fef43bb`](https://github.com/tommy351/kosko/commit/fef43bbde55c5c2c48b0a81c71014513e83a7ad2), [`dc6dfd5`](https://github.com/tommy351/kosko/commit/dc6dfd5918e57e2a0368333b1ced8190dfd801ee), [`affd063`](https://github.com/tommy351/kosko/commit/affd0632bc31033864cbc49620bee870d46437c8), [`4aff238`](https://github.com/tommy351/kosko/commit/4aff2388449a9887ca417db97296a6843854140b)]:
  - @kosko/exec-utils@1.0.0
  - @kosko/yaml@3.0.0
  - @kosko/common-utils@0.1.0

## 0.2.2

### Patch Changes

- Updated dependencies [[`9f16569`](https://github.com/tommy351/kosko/commit/9f165696ffc1274ee28386b5bac979373fbce68b)]:
  - @kosko/exec-utils@0.2.0

## 0.2.1

### Patch Changes

- Updated dependencies []:
  - @kosko/yaml@2.0.1

## 0.2.0

### Minor Changes

- [#92](https://github.com/tommy351/kosko/pull/92) [`100c0c4`](https://github.com/tommy351/kosko/commit/100c0c4db131a386c9fb22c00844ef6618484ca4) Thanks [@tommy351](https://github.com/tommy351)! - When `kustomize build` is not available, `loadKustomize` will fallback to `kubectl kustomize` command automatically. You can also customize the build command with the `buildCommand` option.

## 0.1.0

### Minor Changes

- [#90](https://github.com/tommy351/kosko/pull/90) [`5b71844`](https://github.com/tommy351/kosko/commit/5b71844e700fdec9225c6c1395004a12e0869254) Thanks [@tommy351](https://github.com/tommy351)! - First release.

### Patch Changes

- Updated dependencies [[`5b71844`](https://github.com/tommy351/kosko/commit/5b71844e700fdec9225c6c1395004a12e0869254)]:
  - @kosko/exec-utils@0.1.0
