"use strict";

const { resolve } = require("node:path");
const { cwd } = require("node:process");
const { importPath } = require("../../dist/index.node.cjs");

const path = resolve(cwd(), process.env.IMPORT_PATH);

(async () => {
  process.stdout.write(JSON.stringify(await importPath(path)));
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
