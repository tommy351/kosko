# @kosko/require

## 7.0.2

### Patch Changes

- [`bad060f`](https://github.com/tommy351/kosko/commit/bad060f4ad7430ce00e287b0cfe4ee2d9ca678a1) Thanks [@tommy351](https://github.com/tommy351)! - Fix `ERR_IMPORT_ATTRIBUTE_MISSING` error on Node.js 22+.

## 7.0.1

### Patch Changes

- [`c98b372`](https://github.com/tommy351/kosko/commit/c98b372430983a66c4a78e9358ac26c2cd342718) Thanks [@tommy351](https://github.com/tommy351)! - Remove `.d.mts` files because their contents are as same as `.d.ts` files.

- Updated dependencies [[`c98b372`](https://github.com/tommy351/kosko/commit/c98b372430983a66c4a78e9358ac26c2cd342718)]:
  - @kosko/common-utils@1.1.1

## 7.0.0

### Major Changes

- [#133](https://github.com/tommy351/kosko/pull/133) [`51e93b1`](https://github.com/tommy351/kosko/commit/51e93b134a0f1bf4e05e5d7b9684f1e1cf068edb) Thanks [@tommy351](https://github.com/tommy351)! - `resolve` function is renamed as `resolvePath`.

### Minor Changes

- [#133](https://github.com/tommy351/kosko/pull/133) [`51e93b1`](https://github.com/tommy351/kosko/commit/51e93b134a0f1bf4e05e5d7b9684f1e1cf068edb) Thanks [@tommy351](https://github.com/tommy351)! - Add `resolveModule` function. This function supports both module name and path resolution. Unlike `resolvePath` function which only supports path resolution.

### Patch Changes

- Updated dependencies [[`e904ce3`](https://github.com/tommy351/kosko/commit/e904ce313295d4737ed9bf0d711c26c53f63fd88), [`e904ce3`](https://github.com/tommy351/kosko/commit/e904ce313295d4737ed9bf0d711c26c53f63fd88)]:
  - @kosko/common-utils@1.1.0

## 6.0.0

### Major Changes

- [#129](https://github.com/tommy351/kosko/pull/129) [`d627995`](https://github.com/tommy351/kosko/commit/d62799577863ec561978a1ce430be38e0c5dbb9d) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 14. The minimum supported Node.js version is 18 now.

### Patch Changes

- Updated dependencies [[`d627995`](https://github.com/tommy351/kosko/commit/d62799577863ec561978a1ce430be38e0c5dbb9d)]:
  - @kosko/common-utils@1.0.0

## 5.0.0

### Major Changes

- [#120](https://github.com/tommy351/kosko/pull/120) [`2d5d8ca`](https://github.com/tommy351/kosko/commit/2d5d8ca664b8bdf26d940e60787ed8035262dae6) Thanks [@tommy351](https://github.com/tommy351)! - - `isESMSupported` function is removed because all supported Node.js version supports ESM dynamic import (`import()` function) now.
  - `resolveESM` function is removed.
  - The behavior of `resolve` function has been changed. Now it only supports file or directory resolution, Node.js modules resolution is removed.

### Minor Changes

- [`69729f8`](https://github.com/tommy351/kosko/commit/69729f869caa8f89c88ff29b8675467e0826000d) Thanks [@tommy351](https://github.com/tommy351)! - Support TypeScript `nodenext` module resolution.

### Patch Changes

- Updated dependencies [[`9923210`](https://github.com/tommy351/kosko/commit/9923210d7cb465c787966dc55e7755619a921552), [`69729f8`](https://github.com/tommy351/kosko/commit/69729f869caa8f89c88ff29b8675467e0826000d)]:
  - @kosko/common-utils@0.2.0

## 4.0.1

### Patch Changes

- [#114](https://github.com/tommy351/kosko/pull/114) [`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7) Thanks [@tommy351](https://github.com/tommy351)! - Update docs.

## 4.0.0

### Major Changes

- [#104](https://github.com/tommy351/kosko/pull/104) [`fef43bb`](https://github.com/tommy351/kosko/commit/fef43bbde55c5c2c48b0a81c71014513e83a7ad2) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 12. The minimum supported Node.js version is 14.18.0 now.

## 3.0.0

### Major Changes

- [#88](https://github.com/tommy351/kosko/pull/88) [`fe85506`](https://github.com/tommy351/kosko/commit/fe8550688d7fe53f006bb64b8dd925348facef04) Thanks [@tommy351](https://github.com/tommy351)! - Drop support of Node.js 10. The minimum supported version is Node.js 12 now.

## 2.0.2

### Patch Changes

- [#79](https://github.com/tommy351/kosko/pull/79) [`3f1bc58`](https://github.com/tommy351/kosko/commit/3f1bc58dc9cc2dacfd748471e46b459c81d92c43) Thanks [@tommy351](https://github.com/tommy351)! - Add ES module wrapper. In older version of Node.js (e.g. `14.3.0`), it may be invalid to import `@kosko/require` as below.

  ```js
  import { getRequireExtensions } from "@kosko/require";
  ```

  It throws the following error.

  ```
  file:///workspaces/kosko/packages/env/dist/environment/node.mjs:1
  import { getRequireExtensions } from "@kosko/require";
           ^^^^^^^^^^^^^^^^^^^^
  SyntaxError: The requested module '@kosko/require' does not provide an export named 'getRequireExtensions'
      at ModuleJob._instantiate (internal/modules/esm/module_job.js:97:21)
      at async ModuleJob.run (internal/modules/esm/module_job.js:135:5)
      at async Loader.import (internal/modules/esm/loader.js:178:24)
  ```

  In this release, we use an [ES module wrapper](https://nodejs.org/dist/latest-v14.x/docs/api/packages.html#packages_approach_1_use_an_es_module_wrapper) to re-export functions from the CommonJS entry point. It should fix the issue.

## 2.0.1

### Patch Changes

- [#73](https://github.com/tommy351/kosko/pull/73) [`b6183c3`](https://github.com/tommy351/kosko/commit/b6183c3781ab3f1f1d21de8fbd21e5ef0ca37e17) Thanks [@tommy351](https://github.com/tommy351)! - Add `sideEffect: false` to `package.json`.

## 2.0.0

### Major Changes

- 7e59095: Add support for ECMAScript modules.

  The following functions are added:

  - `isESMSupported` - Return true if ECMAScript modules are supported in the current environment.
  - `importPath` - Imports a module from the given path.
  - `resolveESM` - Resolves path to the specified module. Returns ECMAScript module path when available.
  - `getRequireExtensions` - Returns file extensions which can be imported.

  Breaking changes:

  - `resolve` does not allow `resolve.AsyncOpts` anymore. Only `ResolveOptions` is allowed instead.

## [1.0.4](https://github.com/tommy351/kosko/compare/@kosko/require@1.0.3...@kosko/require@1.0.4) (2021-02-27)

**Note:** Version bump only for package @kosko/require

## [1.0.3](https://github.com/tommy351/kosko/compare/@kosko/require@1.0.2...@kosko/require@1.0.3) (2021-01-31)

**Note:** Version bump only for package @kosko/require

## [1.0.2](https://github.com/tommy351/kosko/compare/@kosko/require@1.0.1...@kosko/require@1.0.2) (2021-01-10)

**Note:** Version bump only for package @kosko/require

## [1.0.1](https://github.com/tommy351/kosko/compare/@kosko/require@1.0.0...@kosko/require@1.0.1) (2020-11-22)

**Note:** Version bump only for package @kosko/require

# [1.0.0](https://github.com/tommy351/kosko/compare/@kosko/require@1.0.0-alpha.1...@kosko/require@1.0.0) (2020-11-22)

**Note:** Version bump only for package @kosko/require

# [1.0.0-alpha.1](https://github.com/tommy351/kosko/compare/@kosko/require@1.0.0-alpha.0...@kosko/require@1.0.0-alpha.1) (2020-11-16)

**Note:** Version bump only for package @kosko/require

# [1.0.0-alpha.0](https://github.com/tommy351/kosko/compare/@kosko/require@1.0.0-alpha.0...@kosko/require@1.0.0-alpha.0) (2020-11-15)

# 1.0.0-alpha.0 (2020-11-15)

### chore

- **deps:** Upgrade deps ([2d9649b](https://github.com/tommy351/kosko/commit/2d9649b2579cdf75529b07ec42d1bc88e8eb937e))

### BREAKING CHANGES

- **deps:** Drop support for Node.js 8

## 0.1.11 (2020-05-23)

## 0.1.10 (2020-05-03)

## 0.1.9 (2019-03-09)

## 0.1.8 (2019-03-08)

## 0.1.7 (2019-01-30)

### Features

- **env:** Allow manually setting CWD ([164138b](https://github.com/tommy351/kosko/commit/164138b5c133d49a84ed85ba31d5e17bd1f05388))

## 0.1.6 (2019-01-09)

## 0.1.5 (2019-01-02)

## [0.1.4](https://github.com/tommy351/kosko/compare/@kosko/require@0.1.3...@kosko/require@0.1.4) (2019-01-02)

## 0.1.3 (2019-01-01)

## 0.1.2 (2019-01-01)

## 0.1.1 (2019-01-01)

# [0.1.0](https://github.com/tommy351/kosko/compare/1e4832fca25d2aaf86b1f2260c8785614be4915e...@kosko/require@0.1.0) (2019-01-01)

### Features

- **require:** New package "require" ([1e4832f](https://github.com/tommy351/kosko/commit/1e4832fca25d2aaf86b1f2260c8785614be4915e))
