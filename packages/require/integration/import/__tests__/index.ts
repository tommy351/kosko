import execa, { NodeOptions } from "execa";
import { dirname, join } from "node:path";

const testDir = dirname(__dirname);

function parseResult(s: string) {
  const data = JSON.parse(s);

  // Node.js 23 adds `module.exports` export on ESM CJS wrapper. Omit it for
  // consistent snapshots.
  // https://github.com/nodejs/node/pull/53848
  delete data["module.exports"];

  return data;
}

describe("Node.js CJS", () => {
  async function execute(options: NodeOptions) {
    return execa.node(join(testDir, "entry-node.cjs"), [], {
      cwd: testDir,
      ...options
    });
  }

  test("should import MJS file", async () => {
    const result = await execute({
      env: { IMPORT_PATH: "file-mjs.mjs" }
    });

    expect(parseResult(result.stdout)).toMatchSnapshot();
  });

  test("should import CJS file", async () => {
    const result = await execute({
      env: { IMPORT_PATH: "file-cjs.cjs" }
    });

    expect(parseResult(result.stdout)).toMatchSnapshot();
  });

  test("should import JSON file", async () => {
    const result = await execute({
      env: { IMPORT_PATH: "file-json.json" }
    });

    expect(parseResult(result.stdout)).toMatchSnapshot();
  });

  test("should import MTS file", async () => {
    const result = await execute({
      env: { IMPORT_PATH: "file-mts.mts" },
      nodeOptions: ["--loader", "ts-node/esm"]
    });

    expect(parseResult(result.stdout)).toMatchSnapshot();
  });

  test("should import JS file in package whose type = commonjs", async () => {
    const result = await execute({
      env: { IMPORT_PATH: "pkg-commonjs/file-js.js" }
    });

    expect(parseResult(result.stdout)).toMatchSnapshot();
  });

  test("should import JS file in package whose type = module", async () => {
    const result = await execute({
      env: { IMPORT_PATH: "pkg-module/file-js.js" }
    });

    expect(parseResult(result.stdout)).toMatchSnapshot();
  });

  test("should import TS file in package whose type = module", async () => {
    const result = await execute({
      env: { IMPORT_PATH: "pkg-module/file-ts.ts" },
      nodeOptions: ["--loader", "ts-node/esm"]
    });

    expect(parseResult(result.stdout)).toMatchSnapshot();
  });
});

describe("Node.js ESM", () => {
  async function execute(options: NodeOptions) {
    return execa.node(join(testDir, "entry-node.mjs"), [], {
      cwd: testDir,
      ...options
    });
  }

  test("should import MJS file", async () => {
    const result = await execute({
      env: { IMPORT_PATH: "file-mjs.mjs" }
    });

    expect(parseResult(result.stdout)).toMatchSnapshot();
  });

  test("should import CJS file", async () => {
    const result = await execute({
      env: { IMPORT_PATH: "file-cjs.cjs" }
    });

    expect(parseResult(result.stdout)).toMatchSnapshot();
  });

  test("should import JSON file", async () => {
    const result = await execute({
      env: { IMPORT_PATH: "file-json.json" }
    });

    expect(parseResult(result.stdout)).toMatchSnapshot();
  });

  test("should import MTS file", async () => {
    const result = await execute({
      env: { IMPORT_PATH: "file-mts.mts" },
      nodeOptions: ["--loader", "ts-node/esm"]
    });

    expect(parseResult(result.stdout)).toMatchSnapshot();
  });

  test("should import JS file in package whose type = commonjs", async () => {
    const result = await execute({
      env: { IMPORT_PATH: "pkg-commonjs/file-js.js" }
    });

    expect(parseResult(result.stdout)).toMatchSnapshot();
  });

  test("should import JS file in package whose type = module", async () => {
    const result = await execute({
      env: { IMPORT_PATH: "pkg-module/file-js.js" }
    });

    expect(parseResult(result.stdout)).toMatchSnapshot();
  });

  test("should import TS file in package whose type = module", async () => {
    const result = await execute({
      env: { IMPORT_PATH: "pkg-module/file-ts.ts" },
      nodeOptions: ["--loader", "ts-node/esm"]
    });

    expect(parseResult(result.stdout)).toMatchSnapshot();
  });
});
