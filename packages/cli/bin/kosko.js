#!/usr/bin/env node

const importLocal = require("import-local");

if (!importLocal(__filename)) {
  const cli = require("../dist/index.node.cjs");
  cli.run().catch(cli.handleError);
}
