"use strict";

module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/packages"],
  collectCoverageFrom: ["packages/*/src/**/*.ts", "!packages/*/src/index.ts"],
  testEnvironment: "node",
  setupTestFrameworkScriptFile: "jest-extended",
  snapshotSerializers: ["jest-serializer-path"]
};
