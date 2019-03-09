"use strict";

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  snapshotSerializers: ["jest-serializer-path"],
  setupFilesAfterEnv: ["jest-extended", "<rootDir>/setup.ts"]
};
