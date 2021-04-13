"use strict";

const { defaults: tsJestPreset } = require("ts-jest/presets");

module.exports = {
  preset: "jest-puppeteer",
  transform: {
    ...tsJestPreset.transform
  }
};
