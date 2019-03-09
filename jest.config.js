"use strict";

module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/packages"],
  collectCoverageFrom: ["packages/*/src/**/*.ts", "!packages/*/src/index.ts"],
  testEnvironment: "node",
  setupFilesAfterEnv: ["jest-extended"],
  snapshotSerializers: ["jest-serializer-path"]
};
