/// <reference types="jest-extended"/>
import execa from "execa";
import { dirname } from "path";
import { runCLI, installPackage } from "@kosko/test-utils";

const testDir = dirname(__dirname);

let args: string[];
let result: execa.ExecaReturnValue;
let options: execa.Options;

beforeAll(async () => {
  await installPackage(testDir, "env");
});

beforeEach(async () => {
  result = await runCLI(args, {
    ...options,
    cwd: testDir
  });
});

describe("when validate is not set", () => {
  beforeAll(() => {
    args = ["generate"];
    options = { reject: false };
  });

  test("should return status code 1", () => {
    expect(result.exitCode).toEqual(1);
  });

  test("should print the error", () => {
    expect(result.stderr).toContain(
      "Error: data/spec must have required property 'containers', data/spec must be null, data/spec must match exactly one schema in oneOf"
    );
  });
});

describe("when validate is true", () => {
  beforeAll(() => {
    args = ["generate", "--validate"];
    options = { reject: false };
  });

  test("should return status code 1", () => {
    expect(result.exitCode).toEqual(1);
  });

  test("should print the error", () => {
    expect(result.stderr).toContain(
      "Error: data/spec must have required property 'containers', data/spec must be null, data/spec must match exactly one schema in oneOf"
    );
  });
});

describe("when validate is false", () => {
  beforeAll(() => {
    args = ["generate", "--validate", "false"];
    options = {};
  });

  test("should return status code 0", () => {
    expect(result.exitCode).toEqual(0);
  });

  test("should print the manifest", () => {
    expect(result.stdout).toMatchSnapshot();
  });
});
