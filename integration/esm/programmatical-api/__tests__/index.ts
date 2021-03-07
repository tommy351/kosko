import execa from "execa";
import { dirname, join } from "path";
import { installPackage } from "../../../run";

const testDir = dirname(__dirname);
let result: execa.ExecaReturnValue;

beforeAll(async () => {
  await installPackage(testDir, "env");
  await installPackage(testDir, "generate");
});

beforeEach(async () => {
  result = await execa.node(join(testDir, "index.mjs"), {
    cwd: testDir
  });
});

test("should print YAML", () => {
  expect(result.stdout).toMatchSnapshot();
});
