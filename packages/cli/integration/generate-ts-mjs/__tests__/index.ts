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

test("should load ES modules specified in args", async () => {
  const result = await runNodeCLI(
    [
      "generate",
      "--import",
      `data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("ts-node/esm", pathToFileURL("./"));`
    ],
    { cwd: testDir }
  );
  expect(result.stdout).toMatchSnapshot();
});

test("should load ES modules specified in config", async () => {
  const result = await runNodeCLI(
    ["generate", "--config", "kosko-import.toml"],
    { cwd: testDir }
  );
  expect(result.stdout).toMatchSnapshot();
});
