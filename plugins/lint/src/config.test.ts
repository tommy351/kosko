/// <reference types="jest-extended" />
import { ConfigError } from "@kosko/plugin";
import { validateConfig } from "./config";
import {
  TempDir,
  TempFile,
  makeTempDir,
  makeTempFile
} from "@kosko/test-utils";
import { basename, dirname, join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";

async function writeConfigJs(content: unknown): Promise<TempFile> {
  const file = await makeTempFile({ postfix: ".js" });

  await writeFile(file.path, `export default ${JSON.stringify(content)};`);

  return file;
}

describe.each([
  { value: "error", expected: "error" },
  { value: "warning", expected: "warning" },
  { value: "warn", expected: "warning" },
  { value: "off", expected: "off" },
  { value: 0, expected: "off" },
  { value: 1, expected: "warning" },
  { value: 2, expected: "error" },
  { value: true, expected: "error" },
  { value: false, expected: "off" }
])("when severity is $value", ({ value, expected }) => {
  describe("full syntax", () => {
    test(`should set severity to ${expected}`, async () => {
      await expect(
        validateConfig({
          cwd: "",
          config: {
            rules: {
              "no-missing-pod-volume-mount": { severity: value }
            }
          }
        })
      ).resolves.toEqual({
        rules: {
          "no-missing-pod-volume-mount": { severity: expected }
        }
      });
    });
  });

  describe("short syntax", () => {
    test(`should set severity to ${expected}`, async () => {
      await expect(
        validateConfig({
          cwd: "",
          config: {
            rules: {
              "no-missing-pod-volume-mount": value
            }
          }
        })
      ).resolves.toEqual({
        rules: {
          "no-missing-pod-volume-mount": { severity: expected }
        }
      });
    });
  });
});

describe.each(["foobar", { severity: "foobar" }])(
  "when severity is %p",
  (config) => {
    test("should throw an error", async () => {
      await expect(
        validateConfig({
          cwd: "",
          config: {
            rules: {
              "no-missing-pod-volume-mount": config
            }
          }
        })
      ).rejects.toThrow(ConfigError);
    });
  }
);

test("should throw an error when config is undefined", async () => {
  await expect(validateConfig({ cwd: "" })).rejects.toThrow(ConfigError);
});

test("should not throw an error when config is an empty object", async () => {
  await expect(validateConfig({ cwd: "", config: {} })).toResolve();
});

test("should throw an error when rule name is unknown", async () => {
  await expect(
    validateConfig({
      cwd: "",
      config: { rules: { foobar: { severity: "error" } } }
    })
  ).rejects.toThrow(ConfigError);
});

describe("when rule has a config", () => {
  test("should not throw an error when config is undefined", async () => {
    await expect(
      validateConfig({
        cwd: "",
        config: {
          rules: {
            "no-missing-namespace": { severity: "error" }
          }
        }
      })
    ).toResolve();
  });

  test("should throw an error when config is invalid", async () => {
    await expect(() =>
      validateConfig({
        cwd: "",
        config: {
          rules: {
            "no-missing-namespace": {
              severity: "error",
              config: { foo: "bar" }
            }
          }
        }
      })
    ).rejects.toThrow(ConfigError);
  });
});

describe("when rule does not have a config", () => {
  test("should not throw an error when config is undefined", async () => {
    await expect(
      validateConfig({
        cwd: "",
        config: {
          rules: {
            "no-missing-pod-volume-mount": { severity: "error" }
          }
        }
      })
    ).toResolve();
  });

  test("should not throw an error when config is an empty object", async () => {
    await expect(
      validateConfig({
        cwd: "",
        config: {
          rules: {
            "no-missing-pod-volume-mount": { severity: "error", config: {} }
          }
        }
      })
    ).toResolve();
  });

  test("should throw an error when config is not an empty object", async () => {
    await expect(
      validateConfig({
        cwd: "",
        config: {
          rules: {
            "no-missing-pod-volume-mount": {
              severity: "error",
              config: { foo: "bar" }
            }
          }
        }
      })
    ).rejects.toThrow(ConfigError);
  });
});

describe("when extends is a relative path", () => {
  let file: TempFile;

  beforeEach(async () => {
    file = await writeConfigJs({
      rules: {
        "no-missing-namespace": "error"
      }
    });
  });

  afterEach(async () => {
    await file.cleanup();
  });

  test("should load extend file", async () => {
    await expect(
      validateConfig({
        cwd: dirname(file.path),
        config: {
          extends: [`./${basename(file.path)}`]
        }
      })
    ).resolves.toEqual({
      rules: {
        "no-missing-namespace": { severity: "error" }
      }
    });
  });
});

describe("when extends is a non-existing relative path", () => {
  test("should throw an error", async () => {
    await expect(
      validateConfig({
        cwd: tmpdir(),
        config: {
          extends: ["./foo.js"]
        }
      })
    ).rejects.toThrow(`Failed to resolve config path "./foo.js"`);
  });
});

describe("when extends is an absolute path", () => {
  let file: TempFile;

  beforeEach(async () => {
    file = await writeConfigJs({
      rules: {
        "no-missing-namespace": "error"
      }
    });
  });

  afterEach(async () => {
    await file.cleanup();
  });

  test("should load extend file", async () => {
    await expect(
      validateConfig({
        cwd: tmpdir(),
        config: {
          extends: [file.path]
        }
      })
    ).resolves.toEqual({
      rules: {
        "no-missing-namespace": { severity: "error" }
      }
    });
  });
});

describe("when extends is a non-existing absolute path", () => {
  test("should throw an error", async () => {
    await expect(
      validateConfig({
        cwd: tmpdir(),
        config: {
          extends: ["/foo.js"]
        }
      })
    ).rejects.toThrow(`Failed to resolve config path "/foo.js"`);
  });
});

describe("when extends is a module name", () => {
  const moduleName = "foobar";
  let tmpDir: TempDir;

  beforeEach(async () => {
    tmpDir = await makeTempDir();
    const modulePath = join(tmpDir.path, "node_modules", moduleName);

    await mkdir(modulePath, { recursive: true });
    await writeFile(
      join(modulePath, "package.json"),
      JSON.stringify({ main: "config.js" })
    );
    await writeFile(
      join(modulePath, "config.js"),
      `module.exports = ${JSON.stringify({
        rules: { "no-missing-namespace": "error" }
      })};`
    );
  });

  afterEach(async () => {
    await tmpDir.cleanup();
  });

  test("should load extend file", async () => {
    await expect(
      validateConfig({
        cwd: tmpDir.path,
        config: {
          extends: [moduleName]
        }
      })
    ).resolves.toEqual({
      rules: {
        "no-missing-namespace": { severity: "error" }
      }
    });
  });
});

describe("when extends is a non-existing module name", () => {
  test("should throw an error", async () => {
    await expect(
      validateConfig({
        cwd: tmpdir(),
        config: {
          extends: ["foobar"]
        }
      })
    ).rejects.toThrow(`Failed to resolve config path "foobar"`);
  });
});

describe("when config contains same key in extends", () => {
  let file: TempFile;

  beforeEach(async () => {
    file = await writeConfigJs({
      rules: {
        "no-missing-namespace": "warning"
      }
    });
  });

  afterEach(async () => {
    await file.cleanup();
  });

  test("should override the value", async () => {
    await expect(
      validateConfig({
        cwd: tmpdir(),
        config: {
          extends: [file.path],
          rules: {
            "no-missing-namespace": "error",
            "no-missing-service": "off",
            "require-container-image": "warning"
          }
        }
      })
    ).resolves.toEqual({
      rules: {
        "no-missing-namespace": { severity: "error" },
        "no-missing-service": { severity: "off" },
        "require-container-image": { severity: "warning" }
      }
    });
  });
});

describe("when multiple extends are used", () => {
  let files: TempFile[];

  beforeEach(async () => {
    files = await Promise.all([
      writeConfigJs({
        rules: {
          "no-missing-namespace": "warning",
          "no-missing-service": "off"
        }
      }),
      writeConfigJs({
        rules: {
          "no-missing-namespace": "error",
          "require-container-image": "warning"
        }
      })
    ]);
  });

  afterEach(async () => {
    await Promise.all(files.map((file) => file.cleanup()));
  });

  test('should merge the values from "extends" in order', async () => {
    await expect(
      validateConfig({
        cwd: tmpdir(),
        config: {
          extends: files.map((file) => file.path)
        }
      })
    ).resolves.toEqual({
      rules: {
        "no-missing-namespace": { severity: "error" },
        "no-missing-service": { severity: "off" },
        "require-container-image": { severity: "warning" }
      }
    });
  });
});

describe("when extends contains extends", () => {
  let files: TempFile[];

  beforeEach(async () => {
    const parent = await writeConfigJs({
      rules: {
        "no-missing-namespace": "warning",
        "no-missing-service": "off"
      }
    });
    const child = await writeConfigJs({
      extends: [parent.path],
      rules: {
        "no-missing-namespace": "error",
        "require-container-image": "warning"
      }
    });

    files = [parent, child];
  });

  afterEach(async () => {
    await Promise.all(files.map((file) => file.cleanup()));
  });

  test('should merge the values from "extends" in order', async () => {
    await expect(
      validateConfig({
        cwd: tmpdir(),
        config: {
          extends: [files[1].path]
        }
      })
    ).resolves.toEqual({
      rules: {
        "no-missing-namespace": { severity: "error" },
        "no-missing-service": { severity: "off" },
        "require-container-image": { severity: "warning" }
      }
    });
  });
});

describe("when extends contains a non-existing extend path", () => {
  let file: TempFile;

  beforeEach(async () => {
    file = await writeConfigJs({
      extends: ["./foo.js"],
      rules: {
        "no-missing-namespace": "error"
      }
    });
  });

  afterEach(async () => {
    await file.cleanup();
  });

  test("should throw an error", async () => {
    await expect(
      validateConfig({
        cwd: dirname(file.path),
        config: {
          extends: [file.path]
        }
      })
    ).rejects.toThrow(`Failed to resolve config path "./foo.js"`);
  });
});
