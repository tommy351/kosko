import execa from "execa";
import { dirname } from "path";
import { runCLI } from "@kosko/test-utils";

const testDir = dirname(__dirname);
let result: execa.ExecaReturnValue;

beforeEach(async () => {
  result = await runCLI(["generate"], {
    cwd: testDir
  });
});

test("should return status code 0", () => {
  expect(result.exitCode).toEqual(0);
});

test("should import ts files", () => {
  expect(result.stdout).toMatchSnapshot();
});
