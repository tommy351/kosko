/// <reference types="jest-extended"/>
import execa from "execa";
import { dirname } from "node:path";
import { runCLI } from "@kosko/test-utils";

const testDir = dirname(__dirname);

let result: execa.ExecaReturnValue;

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
  expect(result.stderr).toMatchSnapshot();
});
