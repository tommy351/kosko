/* eslint-disable node/no-unpublished-require */
"use strict";

const spawn = require("cross-spawn");
const globby = require("globby");
const { dirname } = require("path");

const TSC = "tsc";

const pkgs = globby.sync("packages/*/tsconfig.json").map(dirname);
const args = ["-b", ...pkgs, ...process.argv.slice(2)];

console.log(TSC, ...args);

spawn.sync(TSC, args, {
  stdio: "inherit"
});
