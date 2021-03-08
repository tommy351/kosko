# @kosko/require

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
