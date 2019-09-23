import execa from "execa";
import { dirname } from "path";
import { runCLI, installPackage } from "../../../run";

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
    expect(result.stderr).toStartWith(
      "ValidationError: data.spec should have required property 'containers'"
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
    expect(result.stderr).toStartWith(
      "ValidationError: data.spec should have required property 'containers'"
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
