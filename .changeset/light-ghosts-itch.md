---
"@kosko/require": patch
---

Add ES module wrapper. In older version of Node.js (e.g. `14.3.0`), it may be invalid to import `@kosko/require` as below.

```js
import { getRequireExtensions } from "@kosko/require";
```

It throws the following error.

```
file:///workspaces/kosko/packages/env/dist/environment/node.mjs:1
import { getRequireExtensions } from "@kosko/require";
         ^^^^^^^^^^^^^^^^^^^^
SyntaxError: The requested module '@kosko/require' does not provide an export named 'getRequireExtensions'
    at ModuleJob._instantiate (internal/modules/esm/module_job.js:97:21)
    at async ModuleJob.run (internal/modules/esm/module_job.js:135:5)
    at async Loader.import (internal/modules/esm/loader.js:178:24)
```

In this release, we use an [ES module wrapper](https://nodejs.org/dist/latest-v14.x/docs/api/packages.html#packages_approach_1_use_an_es_module_wrapper) to re-export functions from the CommonJS entry point. It should fix the issue.
