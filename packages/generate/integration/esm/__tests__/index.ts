import execa from "execa";
import { dirname, join } from "node:path";

const testDir = dirname(__dirname);

test("should print YAML", async () => {
  const result = await execa.node(join(testDir, "index.mjs"), [], {
    nodeOptions: ["--loader", "ts-node/esm"]
  });

  expect(result.stdout).toMatchSnapshot();
});
