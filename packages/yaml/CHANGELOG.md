# @kosko/yaml

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
