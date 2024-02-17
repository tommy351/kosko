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
      ["generate", "--config", "./package.toml"],
      { cwd: testDir }
    );

    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when plugin is a CJS file", () => {
  test("should transform manifests", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./file-cjs.toml"],
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
      ["generate", "--config", "./package.toml"],
      { cwd: testDir }
    );

    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when plugin is a ESM file", () => {
  test("should transform manifests", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./file-mjs.toml"],
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
    const result = await runNodeCLI(["generate", "--config", "./multi.toml"], {
      cwd: testDir
    });

    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when plugin does not exist", () => {
  test("should throw an error", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./package.toml"],
      { cwd: testDir, reject: false }
    );

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toContain(
      `Failed to resolve path for the plugin "test-plugin"`
    );
  });
});

describe("when plugin is a TS file", () => {
  test("should transform manifests", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./file-ts-cjs.toml"],
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
    const result = await runNodeCLI(["generate", "--config", "./dir.toml"], {
      cwd: testDir
    });

    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when transformManifest throws an error", () => {
  beforeEach(async () => {
    await linkModule("test-plugin", "transform-error");
  });

  test("should throw an error", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./package.toml"],
      { cwd: testDir, reject: false }
    );

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toContain(
      `ResolveError: An error occurred in transform function`
    );
  });
});

describe("when validateManifest succeeds", () => {
  test("should not throw an error", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./validate.toml"],
      { cwd: testDir }
    );

    expect(result.stdout).toContain("Validation succeeded");
  });
});

describe("when validationManifest throws an error", () => {
  test("should throw an error", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./validate-sync-error.toml"],
      { cwd: testDir, reject: false }
    );

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toContain("Sync error");
  });
});

describe("when validationManifest throws an async error", () => {
  test("should throw an error", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./validate-async-error.toml"],
      { cwd: testDir, reject: false }
    );

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toContain("Async error");
  });
});

describe("when validateAllManifest succeeds", () => {
  test("should not throw an error", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./validate-all.toml"],
      { cwd: testDir }
    );

    expect(result.stdout).toContain("Validation succeeded");
  });
});

describe("when validationAllManifest throws an error", () => {
  test("should throw an error", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./validate-all-sync-error.toml"],
      { cwd: testDir, reject: false }
    );

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toContain("Sync error");
  });
});

describe("when validationAllManifest throws an async error", () => {
  test("should throw an error", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./validate-all-async-error.toml"],
      { cwd: testDir, reject: false }
    );

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toContain("Async error");
  });
});
