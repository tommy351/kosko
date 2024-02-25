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
    const result = await runNodeCLI(["generate", "--config", "./pkg.toml"], {
      cwd: testDir
    });

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
    const result = await runNodeCLI(["generate", "--config", "./pkg.toml"], {
      cwd: testDir
    });

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
    const result = await runNodeCLI(["generate", "--config", "./pkg.toml"], {
      cwd: testDir,
      reject: false
    });

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toContain(
      `Failed to resolve path for plugin "test-plugin"`
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
    const result = await runNodeCLI(["generate", "--config", "./pkg.toml"], {
      cwd: testDir,
      reject: false
    });

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toContain(`An error occurred in transform function`);
    expect(result.stderr).toContain(`Error: oops`);
  });
});

describe("when validateManifest does not report any issues", () => {
  test("should not throw an error", async () => {
    await expect(
      runNodeCLI(["generate", "--config", "./validate-success.toml"], {
        cwd: testDir
      })
    ).toResolve();
  });
});

describe("when validateManifest reports a error", () => {
  test("should throw an error", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./validate-error.toml"],
      {
        cwd: testDir,
        reject: false
      }
    );

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toMatchSnapshot();
  });

  test("should not run validateManifest when validate is false", async () => {
    await expect(
      runNodeCLI(
        [
          "generate",
          "--config",
          "./validate-error.toml",
          "--validate",
          "false"
        ],
        {
          cwd: testDir
        }
      )
    ).toResolve();
  });
});

describe("when validateManifest reports a warning", () => {
  test("should not throw an error", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./validate-warning.toml"],
      {
        cwd: testDir
      }
    );

    expect(result.stdout).toMatchSnapshot();
    expect(result.stderr).toMatchSnapshot();
  });
});

describe("when validateManifest reports multiple issues", () => {
  test("should throw an error", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./validate-multi.toml"],
      {
        cwd: testDir,
        reject: false
      }
    );

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toMatchSnapshot();
  });
});

describe("when validateManifest throws an error", () => {
  test("should throw an error", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./validate-throw.toml"],
      {
        cwd: testDir,
        reject: false
      }
    );

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toContain(
      "An error occurred in validateManifest function"
    );
  });
});

describe("when validateAllManifests does not report any issues", () => {
  test("should not throw an error", async () => {
    await expect(
      runNodeCLI(["generate", "--config", "./validate-all-success.toml"], {
        cwd: testDir
      })
    ).toResolve();
  });
});

describe("when validateAllManifests reports a error", () => {
  test("should throw an error", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./validate-all-error.toml"],
      {
        cwd: testDir,
        reject: false
      }
    );

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toMatchSnapshot();
  });

  test("should not run validateAllManifests when components are specified in CLI args", async () => {
    await expect(
      runNodeCLI(["generate", "--config", "./validate-all-error.toml", "pod"], {
        cwd: testDir
      })
    ).toResolve();
  });

  test("should not run validateAllManifests when validate is false", async () => {
    await expect(
      runNodeCLI(
        [
          "generate",
          "--config",
          "./validate-all-error.toml",
          "--validate",
          "false"
        ],
        {
          cwd: testDir
        }
      )
    ).toResolve();
  });
});

describe("when validateAllManifests reports a warning", () => {
  test("should not throw an error", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./validate-all-warning.toml"],
      {
        cwd: testDir
      }
    );

    expect(result.stdout).toMatchSnapshot();
    expect(result.stderr).toMatchSnapshot();
  });
});

describe("when validateAllManifests throws an error", () => {
  test("should throw an error", async () => {
    const result = await runNodeCLI(
      ["generate", "--config", "./validate-all-throw.toml"],
      {
        cwd: testDir,
        reject: false
      }
    );

    expect(result.exitCode).toEqual(1);
    expect(result.stderr).toContain(
      "An error occurred in validateAllManifests function"
    );
  });
});
