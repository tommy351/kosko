"use strict";

const preset = require("../jest-preset.cjs");

module.exports = {
  ...preset,
  testTimeout: 60000,
  roots: ["<rootDir>"]
};
