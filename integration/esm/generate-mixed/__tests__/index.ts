import execa from "execa";
import { dirname } from "path";
import { installPackage, runCLI } from "../../../run";

const testDir = dirname(__dirname);
let result: execa.ExecaReturnValue;

beforeAll(async () => {
  await installPackage(testDir, "env");
});

beforeEach(async () => {
  result = await runCLI(["generate", "--env", "dev"], {
    cwd: testDir
  });
});

test("should import CJS environment", () => {
  expect(result.stdout).toMatchSnapshot();
});
