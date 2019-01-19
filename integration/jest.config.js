"use strict";

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupTestFrameworkScriptFile: "jest-extended",
  snapshotSerializers: ["jest-serializer-path"],
  setupTestFrameworkScriptFile: "<rootDir>/setup.ts"
};
