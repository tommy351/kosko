import execa from "execa";
import { dirname } from "path";
import { runCLI } from "../../../run";

const testDir = dirname(__dirname);

let result: execa.ExecaReturnValue;

beforeEach(async () => {
  result = await runCLI(["validate"], {
    cwd: testDir,
    reject: false
  });
});

test("should return status code 1", () => {
  expect(result.exitCode).toEqual(1);
});

test("should print the error", () => {
  expect(result.stderr).toStartWith(
    "ValidationError: data.spec should have required property 'containers'"
  );
});
