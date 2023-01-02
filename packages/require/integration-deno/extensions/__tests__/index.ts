import execa from "execa";
import { dirname, join } from "node:path";

const testDir = dirname(__dirname);

describe("Deno", () => {
  test("should return a constant", async () => {
    const result = await execa("deno", ["run", join(testDir, "deno.js")]);

    expect(JSON.parse(result.stdout)).toEqual([".ts", ".js", ".json"]);
  });
});
