import { projectRoot } from "@kosko/test-utils";
import execa from "execa";
import { join } from "node:path";

test("should load Kubernetes objects", async () => {
  const result = await execa("deno", [
    "run",
    "--import-map",
    join(projectRoot, "integration/deno-import-map.json"),
    "-A",
    join(__dirname, "../index.js")
  ]);

  expect(result.stdout).toMatchSnapshot();
});
