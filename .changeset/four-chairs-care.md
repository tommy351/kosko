---
"@kosko/cli": patch
---

Fix the issue that multiple generation errors are not properly formatted.

```sh
# Before
error -
AggregateError
    at handleResolvePromises (/project/node_modules/@kosko/generate/src/resolve.ts:104:11)
    at async Object.generate (/project/node_modules/@kosko/generate/src/generate.ts:184:21)
    at async Object.handler (/project/node_modules/@kosko/cli/src/commands/generate/worker.ts:47:18)
    at async Object.handler (/project/node_modules/@kosko/cli/src/commands/validate.ts:24:5)

# After
components/mysql.ts

✖ Component value resolve failed
  TSError: ⨯ Unable to compile TypeScript:
  components/mysql.ts:11:1 - error TS2588: Cannot assign to 'port' because it is a constant.
  11 port = 81;
     ~~~~
      at createTSError (/project/node_modules/ts-node/src/index.ts:859:12)
      at reportTSError (/project/node_modules/ts-node/src/index.ts:863:19)
      at getOutput (/project/node_modules/ts-node/src/index.ts:1077:36)
      at Object.compile (/project/node_modules/ts-node/src/index.ts:1433:41)
      at Module.m._compile (/project/node_modules/ts-node/src/index.ts:1617:30)
      at Object.require.extensions.<computed> [as .ts] (/project/node_modules/ts-node/src/index.ts:1621:12)

components/nginx.ts

✖ Component value resolve failed
  TSError: ⨯ Unable to compile TypeScript:
  components/nginx.ts:11:1 - error TS2588: Cannot assign to 'port' because it is a constant.
  11 port = 81;
     ~~~~
      at createTSError (/project/node_modules/ts-node/src/index.ts:859:12)
      at reportTSError (/project/node_modules/ts-node/src/index.ts:863:19)
      at getOutput (/project/node_modules/ts-node/src/index.ts:1077:36)
      at Object.compile (/project/node_modules/ts-node/src/index.ts:1433:41)
      at Module.m._compile (/project/node_modules/ts-node/src/index.ts:1617:30)
      at Object.require.extensions.<computed> [as .ts] (/project/node_modules/ts-node/src/index.ts:1621:12)

error - Found 2 errors in total
error - Generate failed
```
