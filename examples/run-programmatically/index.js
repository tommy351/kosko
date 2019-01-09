"use strict";

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
