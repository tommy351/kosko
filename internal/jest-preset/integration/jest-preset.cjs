"use strict";

const { join } = require("node:path");
const preset = require("../jest-preset.cjs");

/** @type import("jest").Config */
module.exports = {
  ...preset,
  roots: ["<rootDir>"],
  // `testTimeout` is not working in projects currently.
  // https://github.com/facebook/jest/issues/9696
  // testTimeout: 60000,
  setupFilesAfterEnv: [
    ...(preset.setupFilesAfterEnv || []),
    join(__dirname, "setup.cjs")
  ]
};
