#!/usr/bin/env node

const importLocal = require("import-local");

if (!importLocal(__filename)) {
  process.env.KOSKO_CLI_BIN = __filename;
  const cli = require("../dist");
  cli.run().catch(cli.handleError);
}
