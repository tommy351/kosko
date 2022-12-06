// @ts-check

"use strict";

/** @type import("jest").Config */
const config = {
  transform: {
    "^.+\\.(t|j)sx?$": require.resolve("@swc/jest")
  },
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  setupFilesAfterEnv: [require.resolve("jest-extended/all")],
  snapshotSerializers: [require.resolve("@kosko/jest-serializer-path")],
  resetMocks: true,
  moduleNameMapper: {
    // Remove `file://` prefix from ESM import paths.
    // On Windows, import URL will be like `file:///C:/foo/bar`, so the third
    // `/` has to be removed too.
    [process.platform === "win32" ? "^file:///(.+)" : "^file://(.+)"]: "$1"
  }
};

module.exports = config;
