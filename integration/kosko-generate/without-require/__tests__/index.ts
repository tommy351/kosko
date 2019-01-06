import execa from "execa";
import { dirname } from "path";
import { runCLI } from "../../../run";

let args: string[];
let result: execa.ExecaReturns;
let options: execa.Options;

beforeEach(async () => {
  result = await runCLI(args, {
    ...options,
    cwd: dirname(__dirname)
  });
});

describe("when output is not set", () => {
  beforeAll(() => {
    args = ["generate", "--env", "dev"];
    options = {};
  });

  test("should return status code 0", () => {
    expect(result.code).toEqual(0);
  });

  test("should output YAML", () => {
    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when output = yaml", () => {
  beforeAll(() => {
    args = ["generate", "--env", "dev", "--output", "yaml"];
    options = {};
  });

  test("should return status code 0", () => {
    expect(result.code).toEqual(0);
  });

  test("should output YAML", () => {
    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when output = json", () => {
  beforeAll(() => {
    args = ["generate", "--env", "dev", "--output", "json"];
    options = {};
  });

  test("should return status code 0", () => {
    expect(result.code).toEqual(0);
  });

  test("should output JSON", () => {
    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when output is invalid", () => {
  beforeAll(() => {
    args = ["generate", "--env", "dev", "--output", "foo"];
    options = { reject: false };
  });

  test("should return status code 1", () => {
    expect(result.code).toEqual(1);
  });

  test("should print the error", () => {
    expect(result.stderr).toMatchSnapshot();
  });
});
