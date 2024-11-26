# @kosko/exec-utils

## 2.1.0

### Minor Changes

- [`9af1462`](https://github.com/tommy351/kosko/commit/9af14624bd8b845f4d343a0510482dbbc8dfc164) Thanks [@tommy351](https://github.com/tommy351)! - Generate ESM declaration files.

## 2.0.1

### Patch Changes

- [`c98b372`](https://github.com/tommy351/kosko/commit/c98b372430983a66c4a78e9358ac26c2cd342718) Thanks [@tommy351](https://github.com/tommy351)! - Remove `.d.mts` files because their contents are as same as `.d.ts` files.

## 2.0.0

### Major Changes

- [#129](https://github.com/tommy351/kosko/pull/129) [`d627995`](https://github.com/tommy351/kosko/commit/d62799577863ec561978a1ce430be38e0c5dbb9d) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 14. The minimum supported Node.js version is 18 now.

## 1.1.0

### Minor Changes

- [#118](https://github.com/tommy351/kosko/pull/118) [`9923210`](https://github.com/tommy351/kosko/commit/9923210d7cb465c787966dc55e7755619a921552) Thanks [@tommy351](https://github.com/tommy351)! - Build bundles with Rollup.

- [`69729f8`](https://github.com/tommy351/kosko/commit/69729f869caa8f89c88ff29b8675467e0826000d) Thanks [@tommy351](https://github.com/tommy351)! - Support TypeScript `nodenext` module resolution.

## 1.0.1

### Patch Changes

- [#114](https://github.com/tommy351/kosko/pull/114) [`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7) Thanks [@tommy351](https://github.com/tommy351)! - Update docs.

## 1.0.0

### Major Changes

- [#104](https://github.com/tommy351/kosko/pull/104) [`fef43bb`](https://github.com/tommy351/kosko/commit/fef43bbde55c5c2c48b0a81c71014513e83a7ad2) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 12. The minimum supported Node.js version is 14.18.0 now.

### Minor Changes

- [#108](https://github.com/tommy351/kosko/pull/108) [`4c34f5d`](https://github.com/tommy351/kosko/commit/4c34f5d1752eec320885ad479daeed7beab10c4a) Thanks [@tommy351](https://github.com/tommy351)! - When `spawn` failed, it will throw a `SpawnError` instead of a `Error`.

- [#106](https://github.com/tommy351/kosko/pull/106) [`4aff238`](https://github.com/tommy351/kosko/commit/4aff2388449a9887ca417db97296a6843854140b) Thanks [@tommy351](https://github.com/tommy351)! - Add `input` to `SpawnOptions`. When this option is provided, the value will be written to `stdin` of a child process.

## 0.2.0

### Minor Changes

- [#98](https://github.com/tommy351/kosko/pull/98) [`9f16569`](https://github.com/tommy351/kosko/commit/9f165696ffc1274ee28386b5bac979373fbce68b) Thanks [@tommy351](https://github.com/tommy351)! - Add options to `spawn` function.

## 0.1.0

### Minor Changes

- [#90](https://github.com/tommy351/kosko/pull/90) [`5b71844`](https://github.com/tommy351/kosko/commit/5b71844e700fdec9225c6c1395004a12e0869254) Thanks [@tommy351](https://github.com/tommy351)! - First release.
