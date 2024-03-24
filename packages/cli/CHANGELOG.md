# @kosko/cli

## 4.1.0

### Minor Changes

- [#133](https://github.com/tommy351/kosko/pull/133) [`6b6ef9a`](https://github.com/tommy351/kosko/commit/6b6ef9ac242725bd25ddb98a57e59e8710fb3ce9) Thanks [@tommy351](https://github.com/tommy351)! - Support `validateManifest` and `validateAllManifests` plugin hooks.

### Patch Changes

- Updated dependencies [[`c6b5645`](https://github.com/tommy351/kosko/commit/c6b5645ad98f9121c555e5749f2c5ca95ba861a2), [`51e93b1`](https://github.com/tommy351/kosko/commit/51e93b134a0f1bf4e05e5d7b9684f1e1cf068edb), [`e904ce3`](https://github.com/tommy351/kosko/commit/e904ce313295d4737ed9bf0d711c26c53f63fd88), [`8492249`](https://github.com/tommy351/kosko/commit/849224919992923d285cbfb75bf8f5c99d1b552f), [`51e93b1`](https://github.com/tommy351/kosko/commit/51e93b134a0f1bf4e05e5d7b9684f1e1cf068edb), [`c6b5645`](https://github.com/tommy351/kosko/commit/c6b5645ad98f9121c555e5749f2c5ca95ba861a2), [`c6b5645`](https://github.com/tommy351/kosko/commit/c6b5645ad98f9121c555e5749f2c5ca95ba861a2), [`e904ce3`](https://github.com/tommy351/kosko/commit/e904ce313295d4737ed9bf0d711c26c53f63fd88), [`e904ce3`](https://github.com/tommy351/kosko/commit/e904ce313295d4737ed9bf0d711c26c53f63fd88), [`e904ce3`](https://github.com/tommy351/kosko/commit/e904ce313295d4737ed9bf0d711c26c53f63fd88), [`2682a05`](https://github.com/tommy351/kosko/commit/2682a05297de6170af0bd4ffd1087a4b054a399e), [`e904ce3`](https://github.com/tommy351/kosko/commit/e904ce313295d4737ed9bf0d711c26c53f63fd88)]:
  - @kosko/generate@5.0.0
  - @kosko/require@7.0.0
  - @kosko/common-utils@1.1.0
  - @kosko/config@4.0.1
  - @kosko/log@2.0.1
  - @kosko/cli-utils@0.1.1
  - @kosko/migrate@5.0.1

## 4.0.0

### Major Changes

- [#129](https://github.com/tommy351/kosko/pull/129) [`d627995`](https://github.com/tommy351/kosko/commit/d62799577863ec561978a1ce430be38e0c5dbb9d) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 14. The minimum supported Node.js version is 18 now.

- [#130](https://github.com/tommy351/kosko/pull/130) [`44f0831`](https://github.com/tommy351/kosko/commit/44f0831554a86e9653061a614a70dd75ae6217f3) Thanks [@tommy351](https://github.com/tommy351)! - `kosko init` command is removed. Please use `npm create kosko` instead.

### Minor Changes

- [#129](https://github.com/tommy351/kosko/pull/129) [`4d09600`](https://github.com/tommy351/kosko/commit/4d096009b6699e9378cc2d667d06bc666a0b25ec) Thanks [@tommy351](https://github.com/tommy351)! - Implement the plugin system.

### Patch Changes

- Updated dependencies [[`5a2e9b2`](https://github.com/tommy351/kosko/commit/5a2e9b28a29c67c98656e0c6ce7e097123ee0013), [`e10f038`](https://github.com/tommy351/kosko/commit/e10f0389d2e80574f03b7827f683e68c1f83e333), [`d627995`](https://github.com/tommy351/kosko/commit/d62799577863ec561978a1ce430be38e0c5dbb9d), [`a375679`](https://github.com/tommy351/kosko/commit/a3756793f15fb76cbf79df70f394b8eb0195099b), [`44f0831`](https://github.com/tommy351/kosko/commit/44f0831554a86e9653061a614a70dd75ae6217f3), [`99f4d51`](https://github.com/tommy351/kosko/commit/99f4d51b9b7391dc255b43842172638bc16c2b02)]:
  - @kosko/config@4.0.0
  - @kosko/migrate@5.0.0
  - @kosko/common-utils@1.0.0
  - @kosko/exec-utils@2.0.0
  - @kosko/generate@4.0.0
  - @kosko/log@2.0.0
  - @kosko/require@6.0.0
  - @kosko/cli-utils@0.1.0

## 3.1.3

### Patch Changes

- Updated dependencies []:
  - @kosko/migrate@4.1.2

## 3.1.2

### Patch Changes

- Updated dependencies [[`8f73504`](https://github.com/tommy351/kosko/commit/8f735043737152ea807dd2131e3d72ea78aabe47), [`1f3c72b`](https://github.com/tommy351/kosko/commit/1f3c72bc0bfd155d5684a61f2856ca76524dd161), [`f3f14ab`](https://github.com/tommy351/kosko/commit/f3f14ab268d84d322cd3890bfcb0827d140dc4bb)]:
  - @kosko/generate@3.2.0
  - @kosko/config@3.2.0

## 3.1.1

### Patch Changes

- Updated dependencies []:
  - @kosko/migrate@4.1.1

## 3.1.0

### Minor Changes

- [#120](https://github.com/tommy351/kosko/pull/120) [`9341c64`](https://github.com/tommy351/kosko/commit/9341c64718f2fac7e406bf64cc8901b92b35f1b3) Thanks [@tommy351](https://github.com/tommy351)! - Add `--esm` option to `kosko migrate` command. This option is disabled on Node.js and always enabled on other platforms.

- [#118](https://github.com/tommy351/kosko/pull/118) [`9923210`](https://github.com/tommy351/kosko/commit/9923210d7cb465c787966dc55e7755619a921552) Thanks [@tommy351](https://github.com/tommy351)! - Build bundles with Rollup.

- [`69729f8`](https://github.com/tommy351/kosko/commit/69729f869caa8f89c88ff29b8675467e0826000d) Thanks [@tommy351](https://github.com/tommy351)! - Support TypeScript `nodenext` module resolution.

### Patch Changes

- Updated dependencies [[`3e29eea`](https://github.com/tommy351/kosko/commit/3e29eea15da2969213c105c0b5248a7756a98dbb), [`9923210`](https://github.com/tommy351/kosko/commit/9923210d7cb465c787966dc55e7755619a921552), [`a2385ca`](https://github.com/tommy351/kosko/commit/a2385cad9e754844c2c036dfab5832f4b15f7d7d), [`f8861b5`](https://github.com/tommy351/kosko/commit/f8861b59f0db4bc2873d7fa82cd43baf4e047f3a), [`e95b118`](https://github.com/tommy351/kosko/commit/e95b11833433f91a37fe483a91b21bcab13fa101), [`2d5d8ca`](https://github.com/tommy351/kosko/commit/2d5d8ca664b8bdf26d940e60787ed8035262dae6), [`69729f8`](https://github.com/tommy351/kosko/commit/69729f869caa8f89c88ff29b8675467e0826000d)]:
  - @kosko/generate@3.1.0
  - @kosko/aggregate-error@0.3.0
  - @kosko/common-utils@0.2.0
  - @kosko/config@3.1.0
  - @kosko/exec-utils@1.1.0
  - @kosko/log@1.1.0
  - @kosko/migrate@4.1.0
  - @kosko/require@5.0.0

## 3.0.3

### Patch Changes

- [#116](https://github.com/tommy351/kosko/pull/116) [`12735f0`](https://github.com/tommy351/kosko/commit/12735f04aaecf22f5117c6b8e9693dc453806e1f) Thanks [@tommy351](https://github.com/tommy351)! - Set up logger in worker.

## 3.0.2

### Patch Changes

- [#114](https://github.com/tommy351/kosko/pull/114) [`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7) Thanks [@tommy351](https://github.com/tommy351)! - Update docs.

- Updated dependencies [[`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7), [`7744bcd`](https://github.com/tommy351/kosko/commit/7744bcdb86bbfff60350638fe27d89781a6714f7)]:
  - @kosko/aggregate-error@0.2.0
  - @kosko/common-utils@0.1.1
  - @kosko/config@3.0.1
  - @kosko/exec-utils@1.0.1
  - @kosko/generate@3.0.2
  - @kosko/log@1.0.1
  - @kosko/migrate@4.0.1
  - @kosko/require@4.0.1

## 3.0.1

### Patch Changes

- Updated dependencies [[`7d253bc`](https://github.com/tommy351/kosko/commit/7d253bcb68c2cea52061178899eada2f1329290f)]:
  - @kosko/generate@3.0.1

## 3.0.0

### Major Changes

- [#104](https://github.com/tommy351/kosko/pull/104) [`fef43bb`](https://github.com/tommy351/kosko/commit/fef43bbde55c5c2c48b0a81c71014513e83a7ad2) Thanks [@tommy351](https://github.com/tommy351)! - Drop support for Node.js 12. The minimum supported Node.js version is 14.18.0 now.

### Minor Changes

- [#108](https://github.com/tommy351/kosko/pull/108) [`f2446ae`](https://github.com/tommy351/kosko/commit/f2446aece5570686ba5594812799cc59077d1986) Thanks [@tommy351](https://github.com/tommy351)! - More human-readable error message for `generate` and `validate` command. Below is an example of validation error message.

  ```
  components/nginx.js - 2 errors

    ✖ ResolveError: Validation error
      Index: [0]
      Kind: apps/v1/Deployment
      Name: nginx

        /spec/replicas must be integer

    ✖ ResolveError: Validation error
      Index: [1]
      Kind: v1/Service
      Name: nginx

        /spec/ports/0/port must be integer
        /spec/type must be equal to one of the allowed values: ["ClusterIP","ExternalName","LoadBalancer","NodePort"]

  error - Generate failed (Total 2 errors)
  ```

- [#108](https://github.com/tommy351/kosko/pull/108) [`affd063`](https://github.com/tommy351/kosko/commit/affd0632bc31033864cbc49620bee870d46437c8) Thanks [@tommy351](https://github.com/tommy351)! - Remove `readonly` attribute from return values.

- [#106](https://github.com/tommy351/kosko/pull/106) [`3df37ee`](https://github.com/tommy351/kosko/commit/3df37ee25c79c892c4644ad91364544a2064203b) Thanks [@tommy351](https://github.com/tommy351)! - Add `--config` option to `generate` and `validate` command. When this option is specified, Kosko will load config file from the given path instead of the default `kosko.toml`.

- [#106](https://github.com/tommy351/kosko/pull/106) [`4aff238`](https://github.com/tommy351/kosko/commit/4aff2388449a9887ca417db97296a6843854140b) Thanks [@tommy351](https://github.com/tommy351)! - Add `--loader` option to `generate` and `validate` command. When `--loader` option or `loaders` in `kosko.toml` is set, Kosko will load [ESM loader](https://nodejs.org/api/esm.html#loaders).

- [#109](https://github.com/tommy351/kosko/pull/109) [`1e20936`](https://github.com/tommy351/kosko/commit/1e20936deaf0761ceeb99f5cbe5b69bc40658eb8) Thanks [@tommy351](https://github.com/tommy351)! - - When running `init` command, install latest dependencies instead of the given versions in `package.json`.

  - Add `--package-manager` option to `init` command. If this option is not specified, Kosko will detect package manager based on the presence of `yarn.lock` or `pnpm-lock.yaml` in the target path.

- [#108](https://github.com/tommy351/kosko/pull/108) [`46ed854`](https://github.com/tommy351/kosko/commit/46ed854bf270c265a0fd8664772b02ddaf16fd55) Thanks [@tommy351](https://github.com/tommy351)! - Add `--bail` option to `generate` and `validate` command. When `--bail` option or `bail` in `kosko.toml` is set to `true`, Kosko will stop immediately when an error occurred.

### Patch Changes

- [#106](https://github.com/tommy351/kosko/pull/106) [`3df37ee`](https://github.com/tommy351/kosko/commit/3df37ee25c79c892c4644ad91364544a2064203b) Thanks [@tommy351](https://github.com/tommy351)! - Fix the issue that `components` and `require` defined in `baseEnvironment` are not loaded.

- Updated dependencies [[`4c34f5d`](https://github.com/tommy351/kosko/commit/4c34f5d1752eec320885ad479daeed7beab10c4a), [`fef43bb`](https://github.com/tommy351/kosko/commit/fef43bbde55c5c2c48b0a81c71014513e83a7ad2), [`dc6dfd5`](https://github.com/tommy351/kosko/commit/dc6dfd5918e57e2a0368333b1ced8190dfd801ee), [`4aff238`](https://github.com/tommy351/kosko/commit/4aff2388449a9887ca417db97296a6843854140b), [`4aff238`](https://github.com/tommy351/kosko/commit/4aff2388449a9887ca417db97296a6843854140b), [`affd063`](https://github.com/tommy351/kosko/commit/affd0632bc31033864cbc49620bee870d46437c8), [`c033b49`](https://github.com/tommy351/kosko/commit/c033b4949ae7456384370cc53a3e9caabbececb6), [`2dc50bc`](https://github.com/tommy351/kosko/commit/2dc50bc7f7c9ac1fa474121e772c1789637506bf), [`c667082`](https://github.com/tommy351/kosko/commit/c66708226949273b20c256533331987d3d638f3b), [`8a6af40`](https://github.com/tommy351/kosko/commit/8a6af40da68fd3a3c8186e3ce008fc06955c4dc4), [`4aff238`](https://github.com/tommy351/kosko/commit/4aff2388449a9887ca417db97296a6843854140b)]:
  - @kosko/exec-utils@1.0.0
  - @kosko/config@3.0.0
  - @kosko/generate@3.0.0
  - @kosko/log@1.0.0
  - @kosko/migrate@4.0.0
  - @kosko/require@4.0.0
  - @kosko/common-utils@0.1.0
  - @kosko/aggregate-error@0.1.0

## 2.1.1

### Patch Changes

- [`6d59e0a`](https://github.com/tommy351/kosko/commit/6d59e0a2318badc577dd570eb13c1f8efc8b592a) Thanks [@tommy351](https://github.com/tommy351)! - Update TypeScript templates.

## 2.1.0

### Minor Changes

- [#98](https://github.com/tommy351/kosko/pull/98) [`44c81ab`](https://github.com/tommy351/kosko/commit/44c81ab9f2f2811179a89420122106b6db991fd5) Thanks [@tommy351](https://github.com/tommy351)! - Add `--typescript` and `--esm` option to `kosko init` command.

### Patch Changes

- Updated dependencies [[`9f16569`](https://github.com/tommy351/kosko/commit/9f165696ffc1274ee28386b5bac979373fbce68b)]:
  - @kosko/exec-utils@0.2.0

## 2.0.2

### Patch Changes

- Updated dependencies [[`75372ef`](https://github.com/tommy351/kosko/commit/75372efd9b05de73eda77895f3b8b968ae3c3055)]:
  - @kosko/log@0.1.0
  - @kosko/config@2.0.1
  - @kosko/generate@2.0.1
  - @kosko/migrate@3.0.1

## 2.0.1

### Patch Changes

- [#94](https://github.com/tommy351/kosko/pull/94) [`784cce5`](https://github.com/tommy351/kosko/commit/784cce5f53388f9d8fc175febc760ef81e772d36) Thanks [@tommy351](https://github.com/tommy351)! - Update initial dependency version.

## 2.0.0

### Major Changes

- [#88](https://github.com/tommy351/kosko/pull/88) [`fe85506`](https://github.com/tommy351/kosko/commit/fe8550688d7fe53f006bb64b8dd925348facef04) Thanks [@tommy351](https://github.com/tommy351)! - Drop support of Node.js 10. The minimum supported version is Node.js 12 now.

### Patch Changes

- Updated dependencies [[`fe85506`](https://github.com/tommy351/kosko/commit/fe8550688d7fe53f006bb64b8dd925348facef04)]:
  - @kosko/config@2.0.0
  - @kosko/generate@2.0.0
  - @kosko/migrate@3.0.0
  - @kosko/require@3.0.0

## 1.2.5

### Patch Changes

- Updated dependencies [[`3f1bc58`](https://github.com/tommy351/kosko/commit/3f1bc58dc9cc2dacfd748471e46b459c81d92c43)]:
  - @kosko/require@2.0.2
  - @kosko/generate@1.2.1
  - @kosko/migrate@2.0.2

## 1.2.4

### Patch Changes

- [#73](https://github.com/tommy351/kosko/pull/73) [`b6183c3`](https://github.com/tommy351/kosko/commit/b6183c3781ab3f1f1d21de8fbd21e5ef0ca37e17) Thanks [@tommy351](https://github.com/tommy351)! - Add `sideEffect: false` to `package.json`.

- Updated dependencies [[`b6183c3`](https://github.com/tommy351/kosko/commit/b6183c3781ab3f1f1d21de8fbd21e5ef0ca37e17), [`2718ffe`](https://github.com/tommy351/kosko/commit/2718ffed812b8224252a47fa0208b70a6c7adab4), [`5c09694`](https://github.com/tommy351/kosko/commit/5c09694e98a72f7335965d57d7935472a74ce974), [`35c5ce8`](https://github.com/tommy351/kosko/commit/35c5ce8cb5745a6befc895c0eb108f0618c25b3a)]:
  - @kosko/config@1.0.5
  - @kosko/generate@1.2.0
  - @kosko/migrate@2.0.1
  - @kosko/require@2.0.1

## 1.2.3

### Patch Changes

- ef48fc3: Fix ERR_PACKAGE_PATH_NOT_EXPORTED error.

## 1.2.2

### Patch Changes

- Update init package.json.

## 1.2.1

### Patch Changes

- Update init package.json.

## 1.2.0

### Minor Changes

- 7e59095: Add support for ECMAScript modules.

### Patch Changes

- Updated dependencies [7e59095]
- Updated dependencies [7e59095]
- Updated dependencies [7e59095]
  - @kosko/require@2.0.0
  - @kosko/generate@1.1.0
  - @kosko/migrate@2.0.0

## [1.1.2](https://github.com/tommy351/kosko/compare/@kosko/cli@1.1.1...@kosko/cli@1.1.2) (2021-02-27)

**Note:** Version bump only for package @kosko/cli

## [1.1.1](https://github.com/tommy351/kosko/compare/@kosko/cli@1.1.0...@kosko/cli@1.1.1) (2021-01-31)

**Note:** Version bump only for package @kosko/cli

# [1.1.0](https://github.com/tommy351/kosko/compare/@kosko/cli@1.0.1...@kosko/cli@1.1.0) (2021-01-10)

### Features

- **cmd:** Update init dependencies ([0bd5b2d](https://github.com/tommy351/kosko/commit/0bd5b2df4e6a424f6a9d0e1452f693d6de31c348))

## [1.0.1](https://github.com/tommy351/kosko/compare/@kosko/cli@1.0.0...@kosko/cli@1.0.1) (2020-11-22)

**Note:** Version bump only for package @kosko/cli

# [1.0.0](https://github.com/tommy351/kosko/compare/@kosko/cli@1.0.0-alpha.2...@kosko/cli@1.0.0) (2020-11-22)

**Note:** Version bump only for package @kosko/cli

# [1.0.0-alpha.2](https://github.com/tommy351/kosko/compare/@kosko/cli@1.0.0-alpha.1...@kosko/cli@1.0.0-alpha.2) (2020-11-16)

**Note:** Version bump only for package @kosko/cli

# [1.0.0-alpha.1](https://github.com/tommy351/kosko/compare/@kosko/cli@1.0.0-alpha.0...@kosko/cli@1.0.0-alpha.1) (2020-11-16)

**Note:** Version bump only for package @kosko/cli

# [1.0.0-alpha.0](https://github.com/tommy351/kosko/compare/@kosko/cli@1.0.0-alpha.0...@kosko/cli@1.0.0-alpha.0) (2020-11-15)

# 1.0.0-alpha.0 (2020-11-15)

### chore

- **deps:** Upgrade deps ([2d9649b](https://github.com/tommy351/kosko/commit/2d9649b2579cdf75529b07ec42d1bc88e8eb937e))

### Features

- **generate:** Nested components ([f24ab7e](https://github.com/tommy351/kosko/commit/f24ab7e3ee43b15c6685da08cfd3d61be9193f1d))
- **yaml:** Add "@kosko/yaml" package ([5e5505e](https://github.com/tommy351/kosko/commit/5e5505e6f0cc622e234d6d71cad61a576fa970d5))

### BREAKING CHANGES

- **deps:** Drop support for Node.js 8

## 0.9.2 (2020-05-23)

## 0.9.1 (2020-05-03)

# 0.9.0 (2019-09-25)

### Features

- **cli:** Override variables using CLI arguments [#31](https://github.com/tommy351/kosko/issues/31) ([725eb9a](https://github.com/tommy351/kosko/commit/725eb9ace5013dacccd5431ffbe9f61dce228032))
- **cli:** Support base environment ([d542f15](https://github.com/tommy351/kosko/commit/d542f15994e2a1cf17e82814a57d8bbf410adc48))

## 0.8.4 (2019-03-31)

### Bug Fixes

- **cli:** Fix "kosko migrate -f -" not working ([61ece13](https://github.com/tommy351/kosko/commit/61ece13640de3026dbcb6f736fff01a6b9e5199d)), closes [#17](https://github.com/tommy351/kosko/issues/17)

## 0.8.3 (2019-03-09)

## 0.8.2 (2019-03-08)

## 0.8.1 (2019-01-31)

# 0.8.0 (2019-01-30)

### Features

- **cli:** Add migrate command ([f39f7ea](https://github.com/tommy351/kosko/commit/f39f7ea3c7f2d0629c17d379c4989aa3f4dd2ec4))

# 0.7.0 (2019-01-20)

### Features

- **cli:** Add validate command ([4ba93c8](https://github.com/tommy351/kosko/commit/4ba93c816eb5472adc0baf9fabe123008cd9d7af))
- **cli:** Add validate option to generate command ([9fcf198](https://github.com/tommy351/kosko/commit/9fcf1987e1c5597508377bdc1d6ba1e7091d9f4d))
- **cli:** Set extensions when generating ([0619569](https://github.com/tommy351/kosko/commit/0619569557a2b190d747e55e712680eda39ec8f1))

## 0.6.1 (2019-01-18)

### Bug Fixes

- Fix some tests failed on macOS ([e99c3cb](https://github.com/tommy351/kosko/commit/e99c3cb76483fe22b5c0eb6b89df5138a5bdc62a))

### Features

- **cli:** Set paths in config to env ([acb7a51](https://github.com/tommy351/kosko/commit/acb7a51b9a45a2d0fca397133b8ed4de891e1284))

# 0.5.0 (2019-01-16)

### Features

- **cli:** Print error stack in gray ([f6ab1f0](https://github.com/tommy351/kosko/commit/f6ab1f0fea83d1d83462c7f86811b7f66b36c006))

# 0.4.0 (2019-01-13)

### Features

- **cli:** Load config in generate command ([40841d1](https://github.com/tommy351/kosko/commit/40841d14f0408ca45d17b819badec92942a604e6))
- **config:** Use TOML for config syntax ([5b6ca6f](https://github.com/tommy351/kosko/commit/5b6ca6ff3c1d46d99f0decb5f4e4e4fd2e69308b))

## 0.3.4 (2019-01-10)

## 0.3.3 (2019-01-09)

### Bug Fixes

- **cli:** Fix init package.json ([93acafa](https://github.com/tommy351/kosko/commit/93acafaeb6487a5b9636589480e280cbeaa539f8))

### Features

- **env:** Allow manually setting CWD ([164138b](https://github.com/tommy351/kosko/commit/164138b5c133d49a84ed85ba31d5e17bd1f05388))

## 0.3.2 (2019-01-09)

### Bug Fixes

- **cli:** Fix generate tests failed on Windows ([351c9f9](https://github.com/tommy351/kosko/commit/351c9f99ef9959ac1cb520a5d85d905560d5415a))
- **cli:** Import modules from local ([dbb9b18](https://github.com/tommy351/kosko/commit/dbb9b188b08d1bf37b6f3d6be17cedbd217ad5da))

## 0.3.1 (2019-01-07)

### Features

- Add kosko package as an alias of @kosko/cli ([3bf798e](https://github.com/tommy351/kosko/commit/3bf798e6a7d0ee14af89f89391c6c4f5cf4ce706))

# 0.3.0 (2019-01-07)

### Features

- Add "env" package ([eb449f8](https://github.com/tommy351/kosko/commit/eb449f89808cf98685901ab473e03645a3991d99))

## 0.2.8 (2019-01-02)

## 0.2.7 (2019-01-02)

## 0.2.6 (2019-01-01)

## 0.2.5 (2019-01-01)

## [0.2.4](https://github.com/tommy351/kosko/compare/@kosko/cli@0.2.3...@kosko/cli@0.2.4) (2019-01-01)

## 0.2.3 (2019-01-01)

## 0.2.2 (2019-01-01)

### Features

- **require:** New package "require" ([1e4832f](https://github.com/tommy351/kosko/commit/1e4832fca25d2aaf86b1f2260c8785614be4915e))

## 0.2.1 (2019-01-01)

# 0.2.0 (2018-12-31)

# 0.1.0 (2018-12-28)
