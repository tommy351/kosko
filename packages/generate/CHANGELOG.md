# @kosko/generate

## 3.0.2

### Patch Changes

- [#114](https://github.com/tommy351/kosko/pull/114) [`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7) Thanks [@tommy351](https://github.com/tommy351)! - Update docs.

- Updated dependencies [[`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7), [`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7)]:
  - @kosko/aggregate-error@0.2.0
  - @kosko/common-utils@0.1.1
  - @kosko/log@1.0.1
  - @kosko/require@4.0.1

## 3.0.1

### Patch Changes

- [#112](https://github.com/tommy351/kosko/pull/112) [`7d253bc`](https://github.com/tommy351/kosko/commit/7d253bcb68c2cea52061178899eada2f1329290f) Thanks [@tommy351](https://github.com/tommy351)! - Respect negate glob patterns (e.g. `!abc`).

## 3.0.0

### Major Changes

- [#104](https://github.com/tommy351/kosko/pull/104) [`fef43bb`](https://github.com/tommy351/kosko/commit/fef43bbde55c5c2c48b0a81c71014513e83a7ad2) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 12. The minimum supported Node.js version is 14.18.0 now.

- [#108](https://github.com/tommy351/kosko/pull/108) [`2dc50bc`](https://github.com/tommy351/kosko/commit/2dc50bc7f7c9ac1fa474121e772c1789637506bf) Thanks [@tommy351](https://github.com/tommy351)! - - All errors in `resolve` function are wrapped with `ResolveError` for better access to context information (e.g. path, kind, name, etc.).

  - Errors in `generate` function are wrapped with `GenerateError` for better access to context.
  - `ValidationError` and `ValidationErrorOptions` are renamed as `ResolveError` and `ResolveErrorOptions` since it's not only used for validation now.
  - All properties in `ResolveError` and `ResolveErrorOptions` are no longer required now.
  - `ResolveError.message` no longer contains context information. You can access context from stack or direct access properties in the error value.
  - The format of `ResolveError.stack` has been changed as below.

    ```
    ResolveError: Validation error
        Path: /path/example
        Index: [1, 2, 3]
        Kind: apps/v1/Deployment
        Name: nginx
        Cause: ValidationError: data/spec is required
            at ...
        at ...
    ```

  - `generate` and `resolve` function now collect all errors rather than stop immediately when an error occurred. You can set `bail: true` to stop immediately. When there are more than one error, they will be wrapped with [`AggregateError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AggregateError).
  - `resolve` function now supports [`Iterable`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol) (e.g. `Array`, `Set`, `Map`, generator) and [`AsyncIterable`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols) (e.g. async generator).
  - [`fast-glob`](https://github.com/mrmlnc/fast-glob) is replaced with a homemade glob function based on [`micromatch`](https://github.com/micromatch/micromatch). The behavior will be slightly different. Please submit an issue if you encounter any unexpected problems.

### Minor Changes

- [#108](https://github.com/tommy351/kosko/pull/108) [`affd063`](https://github.com/tommy351/kosko/commit/affd0632bc31033864cbc49620bee870d46437c8) Thanks [@tommy351](https://github.com/tommy351)! - Remove `readonly` attribute from return values.

### Patch Changes

- Updated dependencies [[`fef43bb`](https://github.com/tommy351/kosko/commit/fef43bbde55c5c2c48b0a81c71014513e83a7ad2), [`dc6dfd5`](https://github.com/tommy351/kosko/commit/dc6dfd5918e57e2a0368333b1ced8190dfd801ee), [`8a6af40`](https://github.com/tommy351/kosko/commit/8a6af40da68fd3a3c8186e3ce008fc06955c4dc4)]:
  - @kosko/log@1.0.0
  - @kosko/require@4.0.0
  - @kosko/common-utils@0.1.0
  - @kosko/aggregate-error@0.1.0

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

## 1.2.1

### Patch Changes

- Updated dependencies [[`3f1bc58`](https://github.com/tommy351/kosko/commit/3f1bc58dc9cc2dacfd748471e46b459c81d92c43)]:
  - @kosko/require@2.0.2

## 1.2.0

### Minor Changes

- [#73](https://github.com/tommy351/kosko/pull/73) [`2718ffe`](https://github.com/tommy351/kosko/commit/2718ffed812b8224252a47fa0208b70a6c7adab4) Thanks [@tommy351](https://github.com/tommy351)! - Add `resolve` function.

* [#73](https://github.com/tommy351/kosko/pull/73) [`5c09694`](https://github.com/tommy351/kosko/commit/5c09694e98a72f7335965d57d7935472a74ce974) Thanks [@tommy351](https://github.com/tommy351)! - Support `Promise` in `generate` and `resolve` function.

- [#73](https://github.com/tommy351/kosko/pull/73) [`35c5ce8`](https://github.com/tommy351/kosko/commit/35c5ce8cb5745a6befc895c0eb108f0618c25b3a) Thanks [@tommy351](https://github.com/tommy351)! - Update the type of `PrintOptions.writer`. The type becomes a simplified `Writer` interface instead of the Node.js stream type.

### Patch Changes

- [#73](https://github.com/tommy351/kosko/pull/73) [`b6183c3`](https://github.com/tommy351/kosko/commit/b6183c3781ab3f1f1d21de8fbd21e5ef0ca37e17) Thanks [@tommy351](https://github.com/tommy351)! - Add `sideEffect: false` to `package.json`.

- Updated dependencies [[`b6183c3`](https://github.com/tommy351/kosko/commit/b6183c3781ab3f1f1d21de8fbd21e5ef0ca37e17)]:
  - @kosko/require@2.0.1

## 1.1.0

### Minor Changes

- 7e59095: Add support for ECMAScript modules.

### Patch Changes

- Updated dependencies [7e59095]
  - @kosko/require@2.0.0

## [1.0.4](https://github.com/tommy351/kosko/compare/@kosko/generate@1.0.3...@kosko/generate@1.0.4) (2021-02-27)

**Note:** Version bump only for package @kosko/generate

## [1.0.3](https://github.com/tommy351/kosko/compare/@kosko/generate@1.0.2...@kosko/generate@1.0.3) (2021-01-31)

**Note:** Version bump only for package @kosko/generate

## [1.0.2](https://github.com/tommy351/kosko/compare/@kosko/generate@1.0.1...@kosko/generate@1.0.2) (2021-01-10)

**Note:** Version bump only for package @kosko/generate

## [1.0.1](https://github.com/tommy351/kosko/compare/@kosko/generate@1.0.0...@kosko/generate@1.0.1) (2020-11-22)

**Note:** Version bump only for package @kosko/generate

# [1.0.0](https://github.com/tommy351/kosko/compare/@kosko/generate@1.0.0-alpha.1...@kosko/generate@1.0.0) (2020-11-22)

**Note:** Version bump only for package @kosko/generate

# [1.0.0-alpha.1](https://github.com/tommy351/kosko/compare/@kosko/generate@1.0.0-alpha.0...@kosko/generate@1.0.0-alpha.1) (2020-11-16)

### Features

- **generate:** Add more info to ValidationError ([7363342](https://github.com/tommy351/kosko/commit/736334299bb0a9d00c95f34fd2f506b2930ab946))

# [1.0.0-alpha.0](https://github.com/tommy351/kosko/compare/@kosko/generate@1.0.0-alpha.0...@kosko/generate@1.0.0-alpha.0) (2020-11-15)

# 1.0.0-alpha.0 (2020-11-15)

### chore

- **deps:** Upgrade deps ([2d9649b](https://github.com/tommy351/kosko/commit/2d9649b2579cdf75529b07ec42d1bc88e8eb937e))

### Features

- **generate:** Nested components ([f24ab7e](https://github.com/tommy351/kosko/commit/f24ab7e3ee43b15c6685da08cfd3d61be9193f1d))
- **yaml:** Add "@kosko/yaml" package ([5e5505e](https://github.com/tommy351/kosko/commit/5e5505e6f0cc622e234d6d71cad61a576fa970d5))

### BREAKING CHANGES

- **deps:** Drop support for Node.js 8

## 0.4.7 (2020-05-23)

## 0.4.6 (2020-05-03)

## 0.4.5 (2019-09-25)

## 0.4.4 (2019-03-09)

## 0.4.3 (2019-03-08)

## 0.4.2 (2019-01-31)

### Bug Fixes

- **generate:** Fix debug message on validation ([9101240](https://github.com/tommy351/kosko/commit/9101240c2467124b787b39458a66fbe8fe900a40))

## 0.4.1 (2019-01-30)

### Bug Fixes

- **generate:** Add missing index to print tests ([40f376b](https://github.com/tommy351/kosko/commit/40f376b8741ef9d9255ccf11f3da902f37ef58b1))

### Features

- **generate:** Add validate to GenerateOptions ([d62d3fb](https://github.com/tommy351/kosko/commit/d62d3fbabf9b5fb43fdbd166052257a33b855482))

# 0.4.0 (2019-01-20)

### Features

- **generate:** Add "extensions" to GenerateOptions ([a3db712](https://github.com/tommy351/kosko/commit/a3db712bdc696cc2d1ef0ec6f4900fbecfe4be07))

## 0.3.8 (2019-01-18)

### Bug Fixes

- Fix some tests failed on macOS ([e99c3cb](https://github.com/tommy351/kosko/commit/e99c3cb76483fe22b5c0eb6b89df5138a5bdc62a))

## 0.3.6 (2019-01-13)

### Features

- **cli:** Load config in generate command ([40841d1](https://github.com/tommy351/kosko/commit/40841d14f0408ca45d17b819badec92942a604e6))
- **env:** Allow manually setting CWD ([164138b](https://github.com/tommy351/kosko/commit/164138b5c133d49a84ed85ba31d5e17bd1f05388))

## 0.3.5 (2019-01-09)

## 0.3.4 (2019-01-07)

## 0.3.3 (2019-01-02)

## 0.3.2 (2019-01-02)

## 0.3.1 (2019-01-01)

# 0.3.0 (2019-01-01)

## 0.2.2 (2019-01-01)

## 0.2.1 (2019-01-01)

### Features

- **require:** New package "require" ([1e4832f](https://github.com/tommy351/kosko/commit/1e4832fca25d2aaf86b1f2260c8785614be4915e))

# [0.2.0](https://github.com/tommy351/kosko/compare/@kosko/generate@0.1.1...@kosko/generate@0.2.0) (2019-01-01)

## 0.1.1 (2018-12-31)

# 0.1.0 (2018-12-28)
