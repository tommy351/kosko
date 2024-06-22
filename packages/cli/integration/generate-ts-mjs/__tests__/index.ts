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
    { cwd: testDir }
  );
  expect(result.stdout).toMatchSnapshot();
});

test("should use import specified in args", async () => {
  const result = await runNodeCLI(
    ["generate", "--import", "@swc-node/register/esm-register"],
    { cwd: testDir, stderr: "inherit" }
  );
  expect(result.stdout).toMatchSnapshot();
});

test("should use import specified in config", async () => {
  const result = await runNodeCLI(
    ["generate", "--config", "kosko-import.toml"],
    { cwd: testDir, stderr: "inherit" }
  );
  expect(result.stdout).toMatchSnapshot();
});
