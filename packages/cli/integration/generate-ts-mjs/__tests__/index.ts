import { dirname } from "path";
import { installPackage, runCLI } from "@kosko/integration-test-utils";

const testDir = dirname(__dirname);

beforeAll(async () => {
  await installPackage(testDir, "env");
});

test("should load loaders specified in args", async () => {
  const result = await runCLI(["generate", "--loader", "ts-node/esm"], {
    cwd: testDir
  });
  expect(result.stdout).toMatchSnapshot();
});

test("should load loaders specified in config", async () => {
  const result = await runCLI(["generate", "--config", "kosko-loader.toml"], {
    cwd: testDir
  });
  expect(result.stdout).toMatchSnapshot();
});
