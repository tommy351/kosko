/// <reference types="jest-extended"/>
import execa from "execa";
import { dirname } from "path";
import { runCLI, installPackage } from "@kosko/integration-test-utils";

const testDir = dirname(__dirname);

let result: execa.ExecaReturnValue;

beforeAll(async () => {
  await installPackage(testDir, "env");
});

beforeEach(async () => {
  result = await runCLI(["validate"], {
    cwd: testDir,
    reject: false
  });
});

test("should return status code 1", () => {
  expect(result.exitCode).toEqual(1);
});

test("should print the error", () => {
  expect(result.stderr).toContain(
    "ValidationError: data/spec must have required property 'containers'"
  );
});
