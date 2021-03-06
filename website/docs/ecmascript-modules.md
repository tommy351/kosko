---
title: ECMAScript Modules
---

:::note Examples

- [ECMAScript Modules](https://github.com/tommy351/kosko/tree/master/examples/esm)
- [Run Programmatically (ESM)](https://github.com/tommy351/kosko/tree/master/examples/run-programmatically-esm)

:::

Kosko supports ECMAScript modules (ESM). You can write components and environments in native ESM files.

Node.js v12 or above is required for ESM. However, Node.js v14.8.0 or above is recommended because [top-level await](https://nodejs.org/dist/latest-v14.x/docs/api/esm.html#esm_top_level_await) is supported without flags in this version.

## Enabling

You don't have to modify any config in `kosko.toml` at all. To start using ESM, you can either set `type` in `package.json` as below.

```json title="package.json"
{
  "type": "module"
}
```

Or rename file extension as `.mjs`. See [Node.js documentation](https://nodejs.org/dist/latest-v14.x/docs/api/packages.html#packages_package_json_and_file_extensions) for more information.

## Environments

When `@kosko/env` is imported in ESM, it returns a `Promise` instead. This is because `import()` is asynchronous. You **MUST** add `await` when retrieving environment variables as below.

```js
import env from "@kosko/env";

const globalParams = await env.global();
const componentParams = await env.component("demo");
```

## Programmatical Usage

You can use `@kosko/env` and `@kosko/generate` package directly. The following is a basic example.

```js
import env from "@kosko/env";
import { generate, print, PrintFormat } from "@kosko/generate";
import { fileURLToPath } from "url";
import { join } from "path";

// Set environment
env.env = "dev";

// Set CWD (optional)
env.cwd = fileURLToPath(new URL("./", import.meta.url));

// Generate manifests
const result = await generate({
  path: join(env.cwd, "components"),
  components: ["*"]
});

// Print manifests to stdout
print(result, {
  format: PrintFormat.YAML,
  writer: process.stdout
});
```

There's no much difference between CommonJS and ESM when using Kosko programmatically. However, it could be troublesome if you are going to use both CommonJS and ESM at the same time. In Node.js, ESM has its own separate cache, which means there are two isolated instances of `Environment` in CommonJS and ESM and both must be initialized separately.

It's recommended to use only one module type. If you really need to use both, here's an example of how to initialize them.

```js
function setupEnv(env) {
  env.env = "dev";
  env.cwd = __dirname;
}

(async () => {
  // CommonJS
  setupEnv(require("@kosko/env"));

  // ESM
  setupEnv((await import("@kosko/env")).default);
})();
```
