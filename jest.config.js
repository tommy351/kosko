"use strict";

module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/packages"],
  collectCoverageFrom: ["packages/*/src/**/*.ts"],
  testEnvironment: "node",
  setupTestFrameworkScriptFile: "jest-extended"
};
