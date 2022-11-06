# @kosko/kustomize

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
