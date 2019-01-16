import execa from "execa";
import { dirname } from "path";
import { runCLI } from "../../../run";

let result: execa.ExecaReturns;

beforeEach(async () => {
  result = await runCLI(["generate"], {
    cwd: dirname(__dirname)
  });
});

test("should return status code 0", () => {
  expect(result.code).toEqual(0);
});

test("should import ts files", () => {
  expect(result.stdout).toMatchSnapshot();
});
