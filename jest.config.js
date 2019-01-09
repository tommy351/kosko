"use strict";

module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/packages", "<rootDir>/integration"],
  collectCoverageFrom: ["packages/*/src/**/*.ts", "!packages/*/src/index.ts"],
  testEnvironment: "node",
  setupTestFrameworkScriptFile: "jest-extended",
  snapshotSerializers: ["jest-serializer-path"]
};
