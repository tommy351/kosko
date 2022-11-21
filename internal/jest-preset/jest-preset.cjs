// @ts-check

"use strict";

/** @type import("jest").Config */
const config = {
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest"
  },
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  setupFilesAfterEnv: [require.resolve("jest-extended/all")],
  snapshotSerializers: [require.resolve("@kosko/jest-serializer-path")],
  resetMocks: true
};

module.exports = config;
