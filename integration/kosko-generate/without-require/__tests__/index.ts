import execa from "execa";
import { dirname } from "path";
import { runCLI } from "../../../run";

let args: string[];
let result: execa.ExecaReturns;

beforeEach(async () => {
  result = await runCLI(args, {
    cwd: dirname(__dirname),
    reject: false
  });
});

describe("when output is not set", () => {
  beforeAll(() => {
    args = ["generate", "--env", "dev"];
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
  });

  test("should return status code 1", () => {
    expect(result.code).toEqual(1);
  });

  test("should print the error", () => {
    expect(result.stderr).toMatchSnapshot();
  });
});
