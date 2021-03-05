"use strict";

const nodeVersion = process.versions.node;
const isESMSupported = +nodeVersion.split(".")[0] >= 14;

module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/packages"],
  collectCoverageFrom: ["packages/*/src/**/*.ts", "!packages/*/src/index.ts"],
  testEnvironment: "node",
  setupFilesAfterEnv: ["jest-extended"],
  snapshotSerializers: ["jest-serializer-path"],
  ...(isESMSupported && {
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.m?[jt]sx?$",
    moduleFileExtensions: ["js", "jsx", "ts", "tsx", "mjs", "json", "node"]
  })
};
