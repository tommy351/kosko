# @kosko/config

## 3.0.1

### Patch Changes

- [#114](https://github.com/tommy351/kosko/pull/114) [`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7) Thanks [@tommy351](https://github.com/tommy351)! - Update docs.

- Updated dependencies [[`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7)]:
  - @kosko/common-utils@0.1.1
  - @kosko/log@1.0.1

## 3.0.0

### Major Changes

- [#104](https://github.com/tommy351/kosko/pull/104) [`fef43bb`](https://github.com/tommy351/kosko/commit/fef43bbde55c5c2c48b0a81c71014513e83a7ad2) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 12. The minimum supported Node.js version is 14.18.0 now.

### Minor Changes

- [#106](https://github.com/tommy351/kosko/pull/106) [`4aff238`](https://github.com/tommy351/kosko/commit/4aff2388449a9887ca417db97296a6843854140b) Thanks [@tommy351](https://github.com/tommy351)! - Add `loaders` config. You can use this option to specify [ESM loader](https://nodejs.org/api/esm.html#loaders).

- [#106](https://github.com/tommy351/kosko/pull/106) [`4aff238`](https://github.com/tommy351/kosko/commit/4aff2388449a9887ca417db97296a6843854140b) Thanks [@tommy351](https://github.com/tommy351)! - `Config` and `EnvironmentConfig` types are not readonly anymore.

- [#108](https://github.com/tommy351/kosko/pull/108) [`affd063`](https://github.com/tommy351/kosko/commit/affd0632bc31033864cbc49620bee870d46437c8) Thanks [@tommy351](https://github.com/tommy351)! - Remove `readonly` attribute from return values.

- [#108](https://github.com/tommy351/kosko/pull/108) [`c033b49`](https://github.com/tommy351/kosko/commit/c033b4949ae7456384370cc53a3e9caabbececb6) Thanks [@tommy351](https://github.com/tommy351)! - Add `bail` to config.

- [#106](https://github.com/tommy351/kosko/pull/106) [`c667082`](https://github.com/tommy351/kosko/commit/c66708226949273b20c256533331987d3d638f3b) Thanks [@tommy351](https://github.com/tommy351)! - `getConfig` function can merge multiple environments now.

### Patch Changes

- Updated dependencies [[`fef43bb`](https://github.com/tommy351/kosko/commit/fef43bbde55c5c2c48b0a81c71014513e83a7ad2), [`dc6dfd5`](https://github.com/tommy351/kosko/commit/dc6dfd5918e57e2a0368333b1ced8190dfd801ee)]:
  - @kosko/log@1.0.0
  - @kosko/common-utils@0.1.0

## 2.0.1

### Patch Changes

- Updated dependencies [[`75372ef`](https://github.com/tommy351/kosko/commit/75372efd9b05de73eda77895f3b8b968ae3c3055)]:
  - @kosko/log@0.1.0

## 2.0.0

### Major Changes

- [#88](https://github.com/tommy351/kosko/pull/88) [`fe85506`](https://github.com/tommy351/kosko/commit/fe8550688d7fe53f006bb64b8dd925348facef04) Thanks [@tommy351](https://github.com/tommy351)! - Drop support of Node.js 10. The minimum supported version is Node.js 12 now.

## 1.0.5

### Patch Changes

- [#73](https://github.com/tommy351/kosko/pull/73) [`b6183c3`](https://github.com/tommy351/kosko/commit/b6183c3781ab3f1f1d21de8fbd21e5ef0ca37e17) Thanks [@tommy351](https://github.com/tommy351)! - Add `sideEffect: false` to `package.json`.

## [1.0.4](https://github.com/tommy351/kosko/compare/@kosko/config@1.0.3...@kosko/config@1.0.4) (2021-02-27)

**Note:** Version bump only for package @kosko/config

## [1.0.3](https://github.com/tommy351/kosko/compare/@kosko/config@1.0.2...@kosko/config@1.0.3) (2021-01-31)

**Note:** Version bump only for package @kosko/config

## [1.0.2](https://github.com/tommy351/kosko/compare/@kosko/config@1.0.1...@kosko/config@1.0.2) (2021-01-10)

**Note:** Version bump only for package @kosko/config

## [1.0.1](https://github.com/tommy351/kosko/compare/@kosko/config@1.0.0...@kosko/config@1.0.1) (2020-11-22)

**Note:** Version bump only for package @kosko/config

# [1.0.0](https://github.com/tommy351/kosko/compare/@kosko/config@1.0.0-alpha.1...@kosko/config@1.0.0) (2020-11-22)

**Note:** Version bump only for package @kosko/config

# [1.0.0-alpha.1](https://github.com/tommy351/kosko/compare/@kosko/config@1.0.0-alpha.0...@kosko/config@1.0.0-alpha.1) (2020-11-16)

**Note:** Version bump only for package @kosko/config

# [1.0.0-alpha.0](https://github.com/tommy351/kosko/compare/@kosko/config@1.0.0-alpha.0...@kosko/config@1.0.0-alpha.0) (2020-11-15)

# 1.0.0-alpha.0 (2020-11-15)

### chore

- **deps:** Upgrade deps ([2d9649b](https://github.com/tommy351/kosko/commit/2d9649b2579cdf75529b07ec42d1bc88e8eb937e))

### BREAKING CHANGES

- **deps:** Drop support for Node.js 8

## 0.4.2 (2020-05-23)

## 0.4.1 (2020-05-03)

# 0.4.0 (2019-09-25)

### Features

- **config:** Add "baseEnvironment" to config ([c1f3e21](https://github.com/tommy351/kosko/commit/c1f3e218511507e935b78af256e953d9fbad6be0))

## 0.3.3 (2019-03-09)

## 0.3.2 (2019-03-08)

## 0.3.1 (2019-01-30)

# 0.3.0 (2019-01-20)

### Features

- **config:** Add "extensions" to config ([4fe921d](https://github.com/tommy351/kosko/commit/4fe921d49e0ce05f42e446ac69cbf882e18977bb))

## 0.2.1 (2019-01-18)

### Features

- **config:** Add paths to config ([ec64a6d](https://github.com/tommy351/kosko/commit/ec64a6de5d15df8acbc0a1d06c67f7c694ed4a82))

## 0.1.1 (2019-01-16)

# 0.1.0 (2019-01-13)

### Features

- **config:** Add package "config" ([a619988](https://github.com/tommy351/kosko/commit/a619988219a025cd89b80c24766af1b4e3770c10))
- **config:** Precompile validation script ([32e896e](https://github.com/tommy351/kosko/commit/32e896e896541ee08a4a1657cb6004909c991742))
- **config:** Use TOML for config syntax ([5b6ca6f](https://github.com/tommy351/kosko/commit/5b6ca6ff3c1d46d99f0decb5f4e4e4fd2e69308b))
