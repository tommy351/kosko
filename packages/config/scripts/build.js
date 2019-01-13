"use strict";

const spawn = require("cross-spawn");
const makeDir = require("make-dir");
const { join, dirname } = require("path");

const root = dirname(__dirname);
const distDir = join(root, "dist");
const schemaPath = join(distDir, "schema.json");

function run(cmd, ...args) {
  console.log(cmd, ...args);
  spawn.sync(cmd, args, { stdio: "inherit" });
}

makeDir.sync(distDir);

run(
  "typescript-json-schema",
  join(root, "src", "types.ts"),
  "Config",
  "-o",
  schemaPath
);

run("ajv", "compile", "-s", schemaPath, "-o", join(distDir, "ajv-validate.js"));
