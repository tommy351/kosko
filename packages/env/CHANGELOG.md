# @kosko/env

## 2.0.0

### Major Changes

- [#73](https://github.com/tommy351/kosko/pull/73) [`b90c724`](https://github.com/tommy351/kosko/commit/b90c724754ee8b7bd6e4e99e037b28a89f71ddb3) Thanks [@tommy351](https://github.com/tommy351)! - Add support for browser. Several APIs were introduced in this release.

  - `Loader` interface
  - `createEnvironment` function
  - `createAsyncEnvironment` function
  - `createNodeCJSEnvironment` function
  - `createNodeESMEnvironment` function
  - `createSyncEnvironment` function
  - `createSyncLoaderReducers` function
  - `createAsyncLoaderReducers` function

  The following example shows how to use this package in browsers.

  ```js
  import env, { createLoaderReducers } from "@kosko/env";

  env.setReducers(reducers => [
    ...reducers,
    ...createAsyncLoaderReducers({
      global: () =>
        import("./environments/dev/index.js").then(mod => mod.default),
      component: name =>
        import(`./environments/dev/${name}.js`).then(mod => mod.default)
    })
  ]);
  ```

  **BREAKING CHANGES**: The following APIs were changed in this release.

  - `Environment` class → `Environment` interface
  - `SyncEnvironment` class → `createNodeCJSEnvironment` function
  - `AsyncEnvironment` class → `createNodeESMEnvironment` function

  You don't have to change anything, unless you initialize these classes manually.

  ```js
  // Before
  const { Environment } = require("@kosko/env");
  const env = new Environment(process.cwd());

  // After
  const { createNodeCJSEnvironment } = require("@kosko/env");
  const env = createNodeCJSEnvironment({ cwd: process.cwd() });
  ```

### Patch Changes

- [#73](https://github.com/tommy351/kosko/pull/73) [`b6183c3`](https://github.com/tommy351/kosko/commit/b6183c3781ab3f1f1d21de8fbd21e5ef0ca37e17) Thanks [@tommy351](https://github.com/tommy351)! - Add `sideEffect: false` to `package.json`.

- Updated dependencies [[`b6183c3`](https://github.com/tommy351/kosko/commit/b6183c3781ab3f1f1d21de8fbd21e5ef0ca37e17)]:
  - @kosko/require@2.0.1

## 1.1.0

### Minor Changes

- 7e59095: Add support for ECMAScript modules. Noted that when you use `@kosko/env` as an ECMAScript module, it returns an `AsyncEnvironment` instead, so you **MUST** add `await` when using these two functions.

  ```js
  // Before
  const env = require("@kosko/env");

  env.global();
  env.component("example");

  // After
  import env from "@kosko/env";

  await env.global();
  await env.component("example");
  ```

### Patch Changes

- Updated dependencies [7e59095]
  - @kosko/require@2.0.0

## [1.0.4](https://github.com/tommy351/kosko/compare/@kosko/env@1.0.3...@kosko/env@1.0.4) (2021-02-27)

**Note:** Version bump only for package @kosko/env

## [1.0.3](https://github.com/tommy351/kosko/compare/@kosko/env@1.0.2...@kosko/env@1.0.3) (2021-01-31)

**Note:** Version bump only for package @kosko/env

## [1.0.2](https://github.com/tommy351/kosko/compare/@kosko/env@1.0.1...@kosko/env@1.0.2) (2021-01-10)

**Note:** Version bump only for package @kosko/env

## [1.0.1](https://github.com/tommy351/kosko/compare/@kosko/env@1.0.0...@kosko/env@1.0.1) (2020-11-22)

**Note:** Version bump only for package @kosko/env

# [1.0.0](https://github.com/tommy351/kosko/compare/@kosko/env@1.0.0-alpha.1...@kosko/env@1.0.0) (2020-11-22)

**Note:** Version bump only for package @kosko/env

# [1.0.0-alpha.1](https://github.com/tommy351/kosko/compare/@kosko/env@1.0.0-alpha.0...@kosko/env@1.0.0-alpha.1) (2020-11-16)

**Note:** Version bump only for package @kosko/env

# [1.0.0-alpha.0](https://github.com/tommy351/kosko/compare/@kosko/env@1.0.0-alpha.0...@kosko/env@1.0.0-alpha.0) (2020-11-15)

# 1.0.0-alpha.0 (2020-11-15)

### chore

- **deps:** Upgrade deps ([2d9649b](https://github.com/tommy351/kosko/commit/2d9649b2579cdf75529b07ec42d1bc88e8eb937e))

### BREAKING CHANGES

- **deps:** Drop support for Node.js 8

## 0.5.2 (2020-05-23)

## 0.5.1 (2020-05-03)

# 0.5.0 (2019-09-25)

### Features

- **cli:** Override variables using CLI arguments [#31](https://github.com/tommy351/kosko/issues/31) ([725eb9a](https://github.com/tommy351/kosko/commit/725eb9ace5013dacccd5431ffbe9f61dce228032))
- **env:** Deep merge global and component env ([b7d0805](https://github.com/tommy351/kosko/commit/b7d0805efea62bc4d8cf56404c1af47ff99e2491))
- **env:** Support multiple envs ([1fb8d73](https://github.com/tommy351/kosko/commit/1fb8d7398f9af346aaff511688b3d88664be967d))

## 0.4.4 (2019-03-09)

## 0.4.3 (2019-03-08)

## 0.4.2 (2019-01-30)

## 0.4.1 (2019-01-18)

### Features

- **env:** Implement custom paths ([ec2fe6a](https://github.com/tommy351/kosko/commit/ec2fe6ad7d96e2ff34aa1e0aeb49da3e0e2ae475))

## 0.3.1 (2019-01-10)

### Bug Fixes

- **env:** Catch MODULE_NOT_FOUND errors only ([27dcda7](https://github.com/tommy351/kosko/commit/27dcda70298407326f01ef4072e9d1f976747470))

# 0.3.0 (2019-01-09)

### Features

- **env:** Allow manually setting CWD ([164138b](https://github.com/tommy351/kosko/commit/164138b5c133d49a84ed85ba31d5e17bd1f05388))

# 0.2.0 (2019-01-09)

### Features

- **env:** Export default to module.exports ([81d92fe](https://github.com/tommy351/kosko/commit/81d92fe4735270c3e888a70b35049a5ba30433fe))

# 0.1.0 (2019-01-07)

### Features

- Add "env" package ([eb449f8](https://github.com/tommy351/kosko/commit/eb449f89808cf98685901ab473e03645a3991d99))
