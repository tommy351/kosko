import { dirname } from "node:path";
import { runNodeCLI } from "../../utils/run";

const testDir = dirname(__dirname);

test("should load loaders specified in args", async () => {
  const result = await runNodeCLI(["generate", "--loader", "ts-node/esm"], {
    cwd: testDir
  });
  expect(result.stdout).toMatchSnapshot();
});

test("should load loaders specified in config", async () => {
  const result = await runNodeCLI(
    ["generate", "--config", "kosko-loader.toml"],
    {
      cwd: testDir
    }
  );
  expect(result.stdout).toMatchSnapshot();
});
