import execa, { NodeOptions } from "execa";
import { dirname, join } from "node:path";

const testDir = dirname(__dirname);

describe("Node.js CJS", () => {
  async function execute(options?: NodeOptions) {
    const result = await execa.node(join(testDir, "node.cjs"), [], options);
    return JSON.parse(result.stdout);
  }

  test("should return require.extensions", async () => {
    await expect(execute()).resolves.toEqual([
      ".cjs",
      ".mjs",
      ".js",
      ".json",
      ".node"
    ]);
  });

  test("should include extensions from required modules", async () => {
    await expect(
      execute({
        nodeOptions: ["-r", "ts-node/register"]
      })
    ).resolves.toEqual([".cjs", ".mjs", ".js", ".json", ".node", ".ts"]);
  });
});

describe("Node.js ESM", () => {
  async function execute(options?: NodeOptions) {
    const result = await execa.node(join(testDir, "node.mjs"), [], options);
    return JSON.parse(result.stdout);
  }

  test("should return require.extensions", async () => {
    await expect(execute()).resolves.toEqual([
      ".cjs",
      ".mjs",
      ".js",
      ".json",
      ".node"
    ]);
  });

  test("should include extensions from loaders", async () => {
    await expect(
      execute({
        nodeOptions: ["--loader", "ts-node/esm"]
      })
    ).resolves.toEqual([".cjs", ".mjs", ".js", ".json", ".node", ".ts"]);
  });
});

describe("Deno", () => {
  test("should return a constant", async () => {
    const result = await execa("deno", ["run", join(testDir, "deno.js")]);

    expect(JSON.parse(result.stdout)).toEqual([".ts", ".js", ".json"]);
  });
});
