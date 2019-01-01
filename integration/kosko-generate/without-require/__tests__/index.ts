import execa from "execa";
import { dirname } from "path";
import { runCLI } from "../../../run";

let args: string[];
let result: execa.ExecaReturns;

beforeEach(async () => {
  result = await runCLI(args, {
    cwd: dirname(__dirname)
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
