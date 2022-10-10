"use strict";

const { defaults: tsJestPreset } = require("ts-jest/presets");

/** @type import("jest").Config */
module.exports = {
  ...tsJestPreset,
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  setupFilesAfterEnv: [require.resolve("jest-extended/all")],
  snapshotSerializers: [require.resolve("@kosko/jest-serializer-path")],
  resetMocks: true
};
