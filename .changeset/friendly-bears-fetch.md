---
"@kosko/env": major
---

Add support for browser. Several APIs were introduced in this release.

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

env.setReducers((reducers) => [
  ...reducers,
  ...createAsyncLoaderReducers({
    global: () => import("./environments/dev/index.js"),
    component: (name) => import(`./environments/dev/${name}.js`)
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
