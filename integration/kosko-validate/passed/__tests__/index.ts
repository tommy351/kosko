import execa from "execa";
import { dirname } from "path";
import { runCLI } from "../../../run";

const testDir = dirname(__dirname);

let result: execa.ExecaReturns;

beforeEach(async () => {
  result = await runCLI(["validate"], {
    cwd: testDir
  });
});

test("should return status code 0", () => {
  expect(result.code).toEqual(0);
});

test("should print the message", () => {
  expect(result.stderr).toEqual(
    expect.stringContaining("Components are valid")
  );
});
