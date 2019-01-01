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

describe("given require = ts-node/register", () => {
  beforeAll(() => {
    args = ["generate", "--env", "dev", "--require", "ts-node/register"];
  });

  test("should import ts files", () => {
    expect(result.stdout).toMatchSnapshot();
  });
});
