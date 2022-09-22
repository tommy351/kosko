"use strict";

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  snapshotSerializers: ["jest-serializer-path"],
  setupFilesAfterEnv: ["jest-extended/all", "<rootDir>/setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/browser"]
};
