"use strict";

const { defaults: tsJestPreset } = require("ts-jest/presets");

module.exports = {
  ...tsJestPreset,
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  setupFilesAfterEnv: [require.resolve("jest-extended/all")],
  snapshotSerializers: [require.resolve("jest-serializer-path")]
};
