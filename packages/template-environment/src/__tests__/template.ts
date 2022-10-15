import { template, INDEX_SCRIPT } from "../template";
import { join } from "node:path";

test("should return files", async () => {
  const result = await template.generate({ name: "dev" });
  expect(result).toEqual({
    files: [
      {
        path: join("environments", "dev", "index.js"),
        content: INDEX_SCRIPT
      }
    ]
  });
});
