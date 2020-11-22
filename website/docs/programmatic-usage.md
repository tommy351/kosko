---
id: programmatic-usage
title: Programmatic Usage
---

:::note Examples

- [Run Programmatically](https://github.com/tommy351/kosko/tree/master/examples/run-programmatically)

:::

In order to run Kosko programmatically, you need at least `@kosko/env` and `@kosko/generate` package. The following is a basic example.

```js
const env = require("@kosko/env");
const { generate, print, PrintFormat } = require("@kosko/generate");
const { join } = require("path");

(async () => {
  // Set environment
  env.env = "dev";

  // Set CWD (Optional)
  env.cwd = __dirname;

  // Generate manifests
  const result = await generate({
    path: join(env.cwd, "components"),
    components: ["*"]
  });

  // Print manifests to stdout
  print(result, {
    format: PrintFormat.JSON,
    writer: process.stdout
  });
})();
```

For more information, please check the [API documentation](/api/).
