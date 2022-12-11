import execa from "execa";
import { dirname } from "node:path";
import { runNodeCLI } from "../../utils/run";

const testDir = dirname(__dirname);
let result: execa.ExecaReturnValue;

beforeEach(async () => {
  result = await runNodeCLI(["generate", "--env", "dev"], {
    cwd: testDir
  });
});

test("should import CJS environment", () => {
  expect(result.stdout).toMatchSnapshot();
});
