# @kosko/migrate

## 7.0.0

### Minor Changes

- [`9af1462`](https://github.com/tommy351/kosko/commit/9af14624bd8b845f4d343a0510482dbbc8dfc164) Thanks [@tommy351](https://github.com/tommy351)! - Generate ESM declaration files.

### Patch Changes

- Updated dependencies [[`9af1462`](https://github.com/tommy351/kosko/commit/9af14624bd8b845f4d343a0510482dbbc8dfc164)]:
  - @kosko/yaml@5.1.0

## 6.0.0

### Patch Changes

- Updated dependencies [[`3485f8a`](https://github.com/tommy351/kosko/commit/3485f8a92129a3b300fae026ea41a9701e523c5f)]:
  - @kosko/yaml@5.0.0

## 5.0.2

### Patch Changes

- [`c98b372`](https://github.com/tommy351/kosko/commit/c98b372430983a66c4a78e9358ac26c2cd342718) Thanks [@tommy351](https://github.com/tommy351)! - Remove `.d.mts` files because their contents are as same as `.d.ts` files.

- Updated dependencies [[`c98b372`](https://github.com/tommy351/kosko/commit/c98b372430983a66c4a78e9358ac26c2cd342718)]:
  - @kosko/yaml@4.0.2

## 5.0.1

### Patch Changes

- Updated dependencies []:
  - @kosko/yaml@4.0.1

## 5.0.0

### Major Changes

- [#130](https://github.com/tommy351/kosko/pull/130) [`e10f038`](https://github.com/tommy351/kosko/commit/e10f0389d2e80574f03b7827f683e68c1f83e333) Thanks [@tommy351](https://github.com/tommy351)! - `@kosko/yaml` is a peer dependency now. It means users must install `@kosko/yaml` alongside this package manually. This change should prevent duplicated `@kosko/yaml` instances.

- [#129](https://github.com/tommy351/kosko/pull/129) [`d627995`](https://github.com/tommy351/kosko/commit/d62799577863ec561978a1ce430be38e0c5dbb9d) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 14. The minimum supported Node.js version is 18 now.

### Patch Changes

- Updated dependencies [[`d627995`](https://github.com/tommy351/kosko/commit/d62799577863ec561978a1ce430be38e0c5dbb9d)]:
  - @kosko/yaml@4.0.0

## 4.1.2

### Patch Changes

- Updated dependencies [[`782a9d3`](https://github.com/tommy351/kosko/commit/782a9d3b79529d04c8a01addc6ef9fb59df8a545)]:
  - @kosko/yaml@3.3.0

## 4.1.1

### Patch Changes

- Updated dependencies [[`ef5e8c0`](https://github.com/tommy351/kosko/commit/ef5e8c00f6a430bb6bad2e55e286d36ee26ad18f)]:
  - @kosko/yaml@3.2.1

## 4.1.0

### Minor Changes

- [#118](https://github.com/tommy351/kosko/pull/118) [`9923210`](https://github.com/tommy351/kosko/commit/9923210d7cb465c787966dc55e7755619a921552) Thanks [@tommy351](https://github.com/tommy351)! - Build bundles with Rollup.

- [#120](https://github.com/tommy351/kosko/pull/120) [`f8861b5`](https://github.com/tommy351/kosko/commit/f8861b59f0db4bc2873d7fa82cd43baf4e047f3a) Thanks [@tommy351](https://github.com/tommy351)! - Add support for ESM format. Output format is CommonJS (`cjs`) on Node.js and ESM (`esm`) on other platforms by default. You can provide `format` option to override the default value.

  ```ts
  // CommonJS
  migrate([], { format: MigrateFormat.CJS });

  // ESM
  migrate([], { format: MigrateFormat.ESM });
  ```

- [`69729f8`](https://github.com/tommy351/kosko/commit/69729f869caa8f89c88ff29b8675467e0826000d) Thanks [@tommy351](https://github.com/tommy351)! - Support TypeScript `nodenext` module resolution.

### Patch Changes

- Updated dependencies [[`9923210`](https://github.com/tommy351/kosko/commit/9923210d7cb465c787966dc55e7755619a921552), [`8f4d82f`](https://github.com/tommy351/kosko/commit/8f4d82f1ceab3f246414f0527ca02f97ae6bd292), [`69729f8`](https://github.com/tommy351/kosko/commit/69729f869caa8f89c88ff29b8675467e0826000d)]:
  - @kosko/yaml@3.2.0

## 4.0.1

### Patch Changes

- [#114](https://github.com/tommy351/kosko/pull/114) [`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7) Thanks [@tommy351](https://github.com/tommy351)! - Update docs.

- Updated dependencies [[`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7), [`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7)]:
  - @kosko/yaml@3.1.0

## 4.0.0

### Major Changes

- [#104](https://github.com/tommy351/kosko/pull/104) [`fef43bb`](https://github.com/tommy351/kosko/commit/fef43bbde55c5c2c48b0a81c71014513e83a7ad2) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 12. The minimum supported Node.js version is 14.18.0 now.

### Minor Changes

- [#108](https://github.com/tommy351/kosko/pull/108) [`affd063`](https://github.com/tommy351/kosko/commit/affd0632bc31033864cbc49620bee870d46437c8) Thanks [@tommy351](https://github.com/tommy351)! - Remove `readonly` attribute from return values.

### Patch Changes

- Updated dependencies [[`fef43bb`](https://github.com/tommy351/kosko/commit/fef43bbde55c5c2c48b0a81c71014513e83a7ad2), [`affd063`](https://github.com/tommy351/kosko/commit/affd0632bc31033864cbc49620bee870d46437c8)]:
  - @kosko/yaml@3.0.0

## 3.0.1

### Patch Changes

- Updated dependencies []:
  - @kosko/yaml@2.0.1

## 3.0.0

### Major Changes

- [#88](https://github.com/tommy351/kosko/pull/88) [`fe85506`](https://github.com/tommy351/kosko/commit/fe8550688d7fe53f006bb64b8dd925348facef04) Thanks [@tommy351](https://github.com/tommy351)! - Drop support of Node.js 10. The minimum supported version is Node.js 12 now.

### Patch Changes

- Updated dependencies [[`fe85506`](https://github.com/tommy351/kosko/commit/fe8550688d7fe53f006bb64b8dd925348facef04)]:
  - @kosko/yaml@2.0.0

## 2.0.2

### Patch Changes

- Updated dependencies []:
  - @kosko/yaml@1.0.2

## 2.0.1

### Patch Changes

- [#73](https://github.com/tommy351/kosko/pull/73) [`b6183c3`](https://github.com/tommy351/kosko/commit/b6183c3781ab3f1f1d21de8fbd21e5ef0ca37e17) Thanks [@tommy351](https://github.com/tommy351)! - Add `sideEffect: false` to `package.json`.

- Updated dependencies [[`b6183c3`](https://github.com/tommy351/kosko/commit/b6183c3781ab3f1f1d21de8fbd21e5ef0ca37e17)]:
  - @kosko/yaml@1.0.1

## 2.0.0

### Major Changes

- 7e59095: Breaking changes: `migrate` and `migrateString` are asynchronous now.

### Patch Changes

- Updated dependencies [7e59095]
  - @kosko/yaml@1.0.0

## [1.0.4](https://github.com/tommy351/kosko/compare/@kosko/migrate@1.0.3...@kosko/migrate@1.0.4) (2021-02-27)

**Note:** Version bump only for package @kosko/migrate

## [1.0.3](https://github.com/tommy351/kosko/compare/@kosko/migrate@1.0.2...@kosko/migrate@1.0.3) (2021-01-31)

**Note:** Version bump only for package @kosko/migrate

## [1.0.2](https://github.com/tommy351/kosko/compare/@kosko/migrate@1.0.1...@kosko/migrate@1.0.2) (2021-01-10)

**Note:** Version bump only for package @kosko/migrate

## [1.0.1](https://github.com/tommy351/kosko/compare/@kosko/migrate@1.0.0...@kosko/migrate@1.0.1) (2020-11-22)

**Note:** Version bump only for package @kosko/migrate

# [1.0.0](https://github.com/tommy351/kosko/compare/@kosko/migrate@1.0.0-alpha.2...@kosko/migrate@1.0.0) (2020-11-22)

**Note:** Version bump only for package @kosko/migrate

# [1.0.0-alpha.2](https://github.com/tommy351/kosko/compare/@kosko/migrate@1.0.0-alpha.1...@kosko/migrate@1.0.0-alpha.2) (2020-11-16)

**Note:** Version bump only for package @kosko/migrate

# [1.0.0-alpha.1](https://github.com/tommy351/kosko/compare/@kosko/migrate@1.0.0-alpha.0...@kosko/migrate@1.0.0-alpha.1) (2020-11-16)

**Note:** Version bump only for package @kosko/migrate

# [1.0.0-alpha.0](https://github.com/tommy351/kosko/compare/@kosko/migrate@1.0.0-alpha.0...@kosko/migrate@1.0.0-alpha.0) (2020-11-15)

# 1.0.0-alpha.0 (2020-11-15)

### chore

- **deps:** Upgrade deps ([2d9649b](https://github.com/tommy351/kosko/commit/2d9649b2579cdf75529b07ec42d1bc88e8eb937e))

### BREAKING CHANGES

- **deps:** Drop support for Node.js 8

## 0.1.5 (2020-05-23)

## 0.1.4 (2020-05-03)

## 0.1.3 (2019-09-25)

## 0.1.2 (2019-03-09)

## 0.1.1 (2019-03-08)

### Bug Fixes

- **migrate:** Ignore empty objects in YAML ([0286175](https://github.com/tommy351/kosko/commit/0286175e76f191495dcfbf8666ff0a877a5aa3c3))

# 0.1.0 (2019-01-30)

### Bug Fixes

- **migrate:** Fix duplicated names in a component file ([e7c6d14](https://github.com/tommy351/kosko/commit/e7c6d14a894ae049e128b06c49d9807702e49478))

### Features

- **cli:** Add migrate command ([f39f7ea](https://github.com/tommy351/kosko/commit/f39f7ea3c7f2d0629c17d379c4989aa3f4dd2ec4))
- **migrate:** Add migrate package ([1b61d4d](https://github.com/tommy351/kosko/commit/1b61d4dfbde79bc6f3a1940abd5acbda4e1fbd98))
