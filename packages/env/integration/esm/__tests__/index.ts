import { dirname, join } from "node:path";
import execa, { NodeOptions } from "execa";

const testDir = dirname(__dirname);

async function execute(options: NodeOptions) {
  return execa.node(join(testDir, "index.mjs"), [], options);
}

test("should load JS file", async () => {
  const result = await execute({
    env: {
      ENV_NAME: "file-js"
    }
  });

  expect(result.stdout).toMatchSnapshot();
});

test("should load JSON file", async () => {
  const result = await execute({
    env: {
      ENV_NAME: "file-json"
    }
  });

  expect(result.stdout).toMatchSnapshot();
});

test("should load TS file", async () => {
  const result = await execute({
    env: {
      ENV_NAME: "file-ts"
    },
    nodeOptions: ["--loader", "ts-node/esm"]
  });

  expect(result.stdout).toMatchSnapshot();
});

test("should load CJS file", async () => {
  const result = await execute({
    env: {
      ENV_NAME: "file-cjs"
    }
  });

  expect(result.stdout).toMatchSnapshot();
});

test("should load MJS file", async () => {
  const result = await execute({
    env: {
      ENV_NAME: "file-mjs"
    }
  });

  expect(result.stdout).toMatchSnapshot();
});

test("should load JS file in folder", async () => {
  const result = await execute({
    env: {
      ENV_NAME: "folder-js"
    }
  });

  expect(result.stdout).toMatchSnapshot();
});
