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

describe("given config file", () => {
  beforeAll(() => {
    args = ["generate"];
  });

  test("should return status code 0", () => {
    expect(result.code).toEqual(0);
  });

  test("should apply configs", () => {
    expect(result.stdout).toMatchSnapshot();
  });
});
