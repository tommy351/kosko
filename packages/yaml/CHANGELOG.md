# @kosko/yaml

## 5.1.0

### Minor Changes

- [`9af1462`](https://github.com/tommy351/kosko/commit/9af14624bd8b845f4d343a0510482dbbc8dfc164) Thanks [@tommy351](https://github.com/tommy351)! - Generate ESM declaration files.

### Patch Changes

- Updated dependencies [[`9af1462`](https://github.com/tommy351/kosko/commit/9af14624bd8b845f4d343a0510482dbbc8dfc164)]:
  - @kosko/common-utils@1.2.0
  - @kosko/log@2.1.0

## 5.0.0

### Major Changes

- [#141](https://github.com/tommy351/kosko/pull/141) [`3485f8a`](https://github.com/tommy351/kosko/commit/3485f8a92129a3b300fae026ea41a9701e523c5f) Thanks [@tommy351](https://github.com/tommy351)! - Support the following YAML 1.1 features to match the behavior of [sigs.k8s.io/yaml](https://pkg.go.dev/sigs.k8s.io/yaml).

  - Numbers starting with `0` (e.g. `0777`) are interpreted as octal numbers, instead of decimal numbers.
  - YAML 1.2 octal number `0o` prefix is still supported.
  - YAML 1.1 booleans (`yes`, `no`, `on`, `off`, `y`, `n`) are interpreted as booleans, instead of strings.

## 4.0.2

### Patch Changes

- [`c98b372`](https://github.com/tommy351/kosko/commit/c98b372430983a66c4a78e9358ac26c2cd342718) Thanks [@tommy351](https://github.com/tommy351)! - Remove `.d.mts` files because their contents are as same as `.d.ts` files.

- Updated dependencies [[`c98b372`](https://github.com/tommy351/kosko/commit/c98b372430983a66c4a78e9358ac26c2cd342718)]:
  - @kosko/common-utils@1.1.1
  - @kosko/log@2.0.2

## 4.0.1

### Patch Changes

- Updated dependencies [[`e904ce3`](https://github.com/tommy351/kosko/commit/e904ce313295d4737ed9bf0d711c26c53f63fd88), [`e904ce3`](https://github.com/tommy351/kosko/commit/e904ce313295d4737ed9bf0d711c26c53f63fd88)]:
  - @kosko/common-utils@1.1.0
  - @kosko/log@2.0.1

## 4.0.0

### Major Changes

- [#129](https://github.com/tommy351/kosko/pull/129) [`d627995`](https://github.com/tommy351/kosko/commit/d62799577863ec561978a1ce430be38e0c5dbb9d) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 14. The minimum supported Node.js version is 18 now.

### Patch Changes

- Updated dependencies [[`d627995`](https://github.com/tommy351/kosko/commit/d62799577863ec561978a1ce430be38e0c5dbb9d)]:
  - @kosko/common-utils@1.0.0
  - @kosko/log@2.0.0

## 3.3.0

### Minor Changes

- [`782a9d3`](https://github.com/tommy351/kosko/commit/782a9d3b79529d04c8a01addc6ef9fb59df8a545) Thanks [@tommy351](https://github.com/tommy351)! - Add `fetch` to `loadUrl` options, which allows users to customize the `fetch` function instead of using the global `fetch`.

## 3.2.1

### Patch Changes

- [`ef5e8c0`](https://github.com/tommy351/kosko/commit/ef5e8c00f6a430bb6bad2e55e286d36ee26ad18f) Thanks [@tommy351](https://github.com/tommy351)! - Fix the type of `loadUrl` option becomes `any` when `DOM` type is not loaded.

## 3.2.0

### Minor Changes

- [#118](https://github.com/tommy351/kosko/pull/118) [`9923210`](https://github.com/tommy351/kosko/commit/9923210d7cb465c787966dc55e7755619a921552) Thanks [@tommy351](https://github.com/tommy351)! - Build bundles with Rollup.

- [#120](https://github.com/tommy351/kosko/pull/120) [`8f4d82f`](https://github.com/tommy351/kosko/commit/8f4d82f1ceab3f246414f0527ca02f97ae6bd292) Thanks [@tommy351](https://github.com/tommy351)! - `node-fetch` is an optional dependency now. Node.js provides global `fetch` API since v18.0.0. You can also provide your own fetch polyfill (e.g. `isomorphic-fetch`, `cross-fetch`) instead. If `global.fetch` is undefined, `node-fetch` will be used automatically.

- [`69729f8`](https://github.com/tommy351/kosko/commit/69729f869caa8f89c88ff29b8675467e0826000d) Thanks [@tommy351](https://github.com/tommy351)! - Support TypeScript `nodenext` module resolution.

### Patch Changes

- Updated dependencies [[`9923210`](https://github.com/tommy351/kosko/commit/9923210d7cb465c787966dc55e7755619a921552), [`69729f8`](https://github.com/tommy351/kosko/commit/69729f869caa8f89c88ff29b8675467e0826000d)]:
  - @kosko/common-utils@0.2.0
  - @kosko/log@1.1.0

## 3.1.0

### Minor Changes

- [#114](https://github.com/tommy351/kosko/pull/114) [`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7) Thanks [@tommy351](https://github.com/tommy351)! - Remove `readonly` modifiers from properties in `ResourceKind` type.

### Patch Changes

- [#114](https://github.com/tommy351/kosko/pull/114) [`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7) Thanks [@tommy351](https://github.com/tommy351)! - Update docs.

- Updated dependencies [[`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7)]:
  - @kosko/common-utils@0.1.1
  - @kosko/log@1.0.1
  - @kosko/require@4.0.1

## 3.0.0

### Major Changes

- [#104](https://github.com/tommy351/kosko/pull/104) [`fef43bb`](https://github.com/tommy351/kosko/commit/fef43bbde55c5c2c48b0a81c71014513e83a7ad2) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 12. The minimum supported Node.js version is 14.18.0 now.
- [#111](https://github.com/tommy351/kosko/pull/111) [`dc6dfd5`](https://github.com/tommy351/kosko/commit/dc6dfd5918e57e2a0368333b1ced8190dfd801ee) Thanks [@tommy351](https://github.com/tommy351)! - Value type in `Manifest` has been changed from `any` to `unknown`. You might need to modify `transform` function to fix type errors. For example:

  ```ts
  // Before
  manifest.metadata.namespace = "foo";

  // After (Preferred)
  import { Pod } from "kubernetes-models/v1/Pod";

  if (Pod.is(manifest)) {
    manifest.metadata.namespace = "foo";
  }

  // After (Another way)
  import { IObjectMeta } from "@kubernetes-models/apimachinery/apis/meta/v1/ObjectMeta";
  (manifest.metadata as IObjectMeta).namespace = "foo";
  ```

### Minor Changes

- [#108](https://github.com/tommy351/kosko/pull/108) [`affd063`](https://github.com/tommy351/kosko/commit/affd0632bc31033864cbc49620bee870d46437c8) Thanks [@tommy351](https://github.com/tommy351)! - Remove `readonly` attribute from return values.

### Patch Changes

- Updated dependencies [[`fef43bb`](https://github.com/tommy351/kosko/commit/fef43bbde55c5c2c48b0a81c71014513e83a7ad2), [`dc6dfd5`](https://github.com/tommy351/kosko/commit/dc6dfd5918e57e2a0368333b1ced8190dfd801ee)]:
  - @kosko/log@1.0.0
  - @kosko/require@4.0.0
  - @kosko/common-utils@0.1.0

## 2.0.1

### Patch Changes

- Updated dependencies [[`75372ef`](https://github.com/tommy351/kosko/commit/75372efd9b05de73eda77895f3b8b968ae3c3055)]:
  - @kosko/log@0.1.0

## 2.0.0

### Major Changes

- [#88](https://github.com/tommy351/kosko/pull/88) [`fe85506`](https://github.com/tommy351/kosko/commit/fe8550688d7fe53f006bb64b8dd925348facef04) Thanks [@tommy351](https://github.com/tommy351)! - Drop support of Node.js 10. The minimum supported version is Node.js 12 now.

### Patch Changes

- Updated dependencies [[`fe85506`](https://github.com/tommy351/kosko/commit/fe8550688d7fe53f006bb64b8dd925348facef04)]:
  - @kosko/require@3.0.0

## 1.0.2

### Patch Changes

- Updated dependencies [[`3f1bc58`](https://github.com/tommy351/kosko/commit/3f1bc58dc9cc2dacfd748471e46b459c81d92c43)]:
  - @kosko/require@2.0.2

## 1.0.1

### Patch Changes

- [#73](https://github.com/tommy351/kosko/pull/73) [`b6183c3`](https://github.com/tommy351/kosko/commit/b6183c3781ab3f1f1d21de8fbd21e5ef0ca37e17) Thanks [@tommy351](https://github.com/tommy351)! - Add `sideEffect: false` to `package.json`.

- Updated dependencies [[`b6183c3`](https://github.com/tommy351/kosko/commit/b6183c3781ab3f1f1d21de8fbd21e5ef0ca37e17)]:
  - @kosko/require@2.0.1

## 1.0.0

### Major Changes

- 7e59095: Add support for ECMAScript modules.

  Breaking changes: `loadString`, `getResourceModule` functions return `Promise` now, because `import()` is asynchronous.

### Patch Changes

- Updated dependencies [7e59095]
  - @kosko/require@2.0.0

## [0.1.4](https://github.com/tommy351/kosko/compare/@kosko/yaml@0.1.3...@kosko/yaml@0.1.4) (2021-02-27)

**Note:** Version bump only for package @kosko/yaml

## [0.1.3](https://github.com/tommy351/kosko/compare/@kosko/yaml@0.1.2...@kosko/yaml@0.1.3) (2021-01-31)

**Note:** Version bump only for package @kosko/yaml

## [0.1.2](https://github.com/tommy351/kosko/compare/@kosko/yaml@0.1.1...@kosko/yaml@0.1.2) (2021-01-10)

**Note:** Version bump only for package @kosko/yaml

## [0.1.1](https://github.com/tommy351/kosko/compare/@kosko/yaml@0.1.0...@kosko/yaml@0.1.1) (2020-11-22)

**Note:** Version bump only for package @kosko/yaml

# [0.1.0](https://github.com/tommy351/kosko/compare/@kosko/yaml@0.1.0-alpha.1...@kosko/yaml@0.1.0) (2020-11-22)

**Note:** Version bump only for package @kosko/yaml

# [0.1.0-alpha.1](https://github.com/tommy351/kosko/compare/@kosko/yaml@0.1.0-alpha.0...@kosko/yaml@0.1.0-alpha.1) (2020-11-16)

### Features

- **yaml:** Filter manifests ([b53b5eb](https://github.com/tommy351/kosko/commit/b53b5eb0b2ec0f3da8ec1483923c54606634d9b2))

# [0.1.0-alpha.0](https://github.com/tommy351/kosko/compare/@kosko/yaml@0.0.1-alpha.0...@kosko/yaml@0.1.0-alpha.0) (2020-11-16)

### Features

- **yaml:** Add transform option ([2423221](https://github.com/tommy351/kosko/commit/24232210ce0c1b0d12acf0a5761718d82504eda1))

## [0.0.1-alpha.0](https://github.com/tommy351/kosko/compare/@kosko/yaml@0.0.1-alpha.0...@kosko/yaml@0.0.1-alpha.0) (2020-11-15)

## 0.0.1-alpha.0 (2020-11-15)

### Features

- **yaml:** Add "@kosko/yaml" package ([5e5505e](https://github.com/tommy351/kosko/commit/5e5505e6f0cc622e234d6d71cad61a576fa970d5))
- **yaml:** Add loadString function ([678d7f5](https://github.com/tommy351/kosko/commit/678d7f557d946ec86c5234ad7852c5b20e3d0dbe))
- **yaml:** Add loadUrl function ([7b8bac9](https://github.com/tommy351/kosko/commit/7b8bac90d92db596a9bb705f4146edd110b28246))
- **yaml:** Create classes with kubernetes-models ([606a3f4](https://github.com/tommy351/kosko/commit/606a3f473cff94ab97e4c62a2ae2801b30ebd4f1))
