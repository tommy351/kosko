import execa from "execa";
import { dirname, join } from "node:path";
import { installPackage } from "@kosko/test-utils";

const testDir = dirname(__dirname);

beforeAll(async () => {
  await installPackage(testDir, "yaml");
});

test("should load Kubernetes objects", async () => {
  const result = await execa.node(join(testDir, "index.mjs"), {
    cwd: testDir
  });

  expect(result.stdout).toMatchSnapshot();
});
