import execa from "execa";
import { dirname } from "node:path";
import { runNodeCLI } from "../../utils/run";

const testDir = dirname(__dirname);

let result: execa.ExecaReturnValue;

beforeEach(async () => {
  result = await runNodeCLI(["generate"], {
    cwd: testDir,
    reject: false,
    env: {
      // Disable ExperimentalWarning
      NODE_NO_WARNINGS: "1"
    }
  });
});

test("should return status code 1", () => {
  expect(result.exitCode).toEqual(1);
});

test("should print the error", () => {
  expect(result.stderr).toMatchSnapshot();
});
