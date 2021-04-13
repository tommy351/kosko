"use strict";

const nodeVersion = process.versions.node;
const isESMSupported = +nodeVersion.split(".")[0] >= 14;

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  snapshotSerializers: ["jest-serializer-path"],
  setupFilesAfterEnv: ["jest-extended", "<rootDir>/setup.ts"],
  testPathIgnorePatterns: [
    "<rootDir>/browser",
    ...(isESMSupported ? [] : ["<rootDir>/esm/"])
  ]
};
