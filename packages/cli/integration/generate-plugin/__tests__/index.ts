import { runNodeCLI } from "../../utils/run";
import { dirname, join } from "node:path";
import { mkdir, rm, symlink } from "node:fs/promises";

const testDir = dirname(__dirname);

async function linkModule(name: string, path: string) {
  const src = join(testDir, "modules", path);
  const dst = join(testDir, "node_modules", name);

  await mkdir(dirname(dst), { recursive: true });
  await symlink(src, dst, "dir");
}

afterEach(async () => {
  await rm(join(testDir, "node_modules"), { recursive: true, force: true });
});

describe("when plugin is a CJS package", () => {
  beforeEach(async () => {
    await linkModule("test-plugin", "cjs");
  });

  test("should transform manifests", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./kosko-package.toml"],
      { cwd: testDir }
    );

    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when plugin is a CJS file", () => {
  test("should transform manifests", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./kosko-file-cjs.toml"],
      {
        cwd: testDir
      }
    );

    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when plugin is a ESM package", () => {
  beforeEach(async () => {
    await linkModule("test-plugin", "mjs");
  });

  test("should transform manifests", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./kosko-package.toml"],
      { cwd: testDir }
    );

    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when plugin is a ESM file", () => {
  test("should transform manifests", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./kosko-file-mjs.toml"],
      { cwd: testDir }
    );

    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when multiple plugins are specified", () => {
  beforeEach(async () => {
    await linkModule("test-plugin", "cjs");
  });

  test("should transform manifests", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./kosko-multi.toml"],
      { cwd: testDir }
    );

    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when plugin does not exist", () => {
  test("should throw an error", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./kosko-package.toml"],
      { cwd: testDir, reject: false }
    );

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toContain(
      `Failed to resolve path for plugin "test-plugin"`
    );
  });
});

describe("when plugin is a TS file", () => {
  test("should transform manifests", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./kosko-file-ts-cjs.toml"],
      {
        cwd: testDir,
        env: { TS_NODE_PROJECT: join(testDir, "modules/ts-cjs/tsconfig.json") }
      }
    );

    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when plugin is a directory", () => {
  test("should transform manifests", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./kosko-dir.toml"],
      { cwd: testDir }
    );

    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when transformManifest throws an error", () => {
  beforeEach(async () => {
    await linkModule("test-plugin", "transform-error");
  });

  test("should throw an error", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./kosko-package.toml"],
      { cwd: testDir, reject: false }
    );

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toContain(`An error occurred in transform function`);
    expect(result.stderr).toContain(`Error: oops`);
  });
});
