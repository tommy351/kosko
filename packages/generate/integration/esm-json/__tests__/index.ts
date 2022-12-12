import { installPackage } from "@kosko/test-utils";
import execa from "execa";
import { dirname, join } from "node:path";

const testDir = dirname(__dirname);

beforeAll(async () => {
  await installPackage(testDir, "generate");
});

test("should print YAML", async () => {
  const result = await execa.node(join(testDir, "index.mjs"));

  expect(result.stdout).toMatchSnapshot();
});
