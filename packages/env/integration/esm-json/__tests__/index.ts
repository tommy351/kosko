import { installPackage } from "@kosko/test-utils";
import { dirname, join } from "node:path";
import execa from "execa";

const testDir = dirname(__dirname);

beforeAll(async () => {
  await installPackage(testDir, "env");
});

test("should load JSON file", async () => {
  const result = await execa.node(join(testDir, "index.mjs"));

  expect(result.stdout).toMatchSnapshot();
});
