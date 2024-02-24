/// <reference types="jest-extended"/>
import { generate } from "../generate";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { GenerateError, ResolveError } from "../error";
import { getRejectedValue, makeTempDir, TempDir } from "@kosko/test-utils";
import stringify from "fast-safe-stringify";
import { ManifestToValidate } from "../base";
import assert from "node:assert";

jest.mock("@kosko/require", () => {
  const mod = jest.requireActual("@kosko/require");

  return {
    ...mod,
    getRequireExtensions: () => [".js", ".json"]
  };
});

let tmpDir: TempDir;

async function createTempFiles(files: Record<string, string>) {
  for (const [path, content] of Object.entries(files)) {
    const fullPath = join(tmpDir.path, path);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, content);
  }
}

beforeEach(async () => {
  tmpDir = await makeTempDir();
});

afterEach(async () => {
  await tmpDir.cleanup();
});

describe("single JS file", () => {
  beforeEach(async () => {
    await createTempFiles({
      "foo.js": "module.exports = {foo: 'bar'}"
    });
  });

  test("should load the file", async () => {
    const result = await generate({
      components: ["*"],
      path: tmpDir.path
    });
    expect(result).toEqual({
      manifests: [
        {
          path: join(tmpDir.path, "foo.js"),
          index: [],
          issues: [],
          data: { foo: "bar" }
        }
      ]
    });
  });
});

describe("JS files in folder", () => {
  beforeEach(async () => {
    await createTempFiles({
      "foo/index.js": "module.exports = {foo: 'index'}",
      "foo/bar.js": "module.exports = {foo: 'bar'}"
    });
  });

  test("should load index only", async () => {
    const result = await generate({
      components: ["*"],
      path: tmpDir.path
    });
    expect(result).toEqual({
      manifests: [
        {
          path: join(tmpDir.path, "foo/index.js"),
          index: [],
          issues: [],
          data: { foo: "index" }
        }
      ]
    });
  });
});

describe("empty folder", () => {
  beforeEach(async () => {
    await mkdir(join(tmpDir.path, "foo"), { recursive: true });
  });

  test("should ignore the folder", async () => {
    const result = await generate({
      components: ["*"],
      path: tmpDir.path
    });
    expect(result).toEqual({ manifests: [] });
  });
});

describe("folder without index file", () => {
  beforeEach(async () => {
    await createTempFiles({
      "foo/bar.js": "module.exports = {foo: 'bar'}"
    });
  });

  test("should ignore the folder", async () => {
    const result = await generate({
      components: ["*"],
      path: tmpDir.path
    });
    expect(result).toEqual({ manifests: [] });
  });
});

describe("ES module", () => {
  beforeEach(async () => {
    await createTempFiles({
      "foo.js": `
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {foo: "bar"};`
    });
  });

  test("should load default export", async () => {
    const result = await generate({
      components: ["*"],
      path: tmpDir.path
    });
    expect(result).toEqual({
      manifests: [
        {
          path: join(tmpDir.path, "foo.js"),
          index: [],
          issues: [],
          data: { foo: "bar" }
        }
      ]
    });
  });
});

describe("when script exports an array", () => {
  beforeEach(async () => {
    await createTempFiles({
      "foo.js": "module.exports = [{foo: 1}, {bar: 2}]"
    });
  });

  test("should load the array", async () => {
    const result = await generate({
      components: ["*"],
      path: tmpDir.path
    });
    expect(result).toEqual({
      manifests: [
        {
          path: join(tmpDir.path, "foo.js"),
          index: [0],
          issues: [],
          data: { foo: 1 }
        },
        {
          path: join(tmpDir.path, "foo.js"),
          index: [1],
          issues: [],
          data: { bar: 2 }
        }
      ]
    });
  });
});

describe("when script exports a nested array", () => {
  beforeEach(async () => {
    await createTempFiles({
      "foo.js": `
module.exports = [
  {a: 1},
  [
    {b: 2},
    [{c: 3}, {d: 4}]
  ],
  {e: 5}
]`
    });
  });

  test("should load the array", async () => {
    const result = await generate({
      components: ["*"],
      path: tmpDir.path
    });
    const path = join(tmpDir.path, "foo.js");
    expect(result).toEqual({
      manifests: [
        { path, index: [0], issues: [], data: { a: 1 } },
        { path, index: [1, 0], issues: [], data: { b: 2 } },
        { path, index: [1, 1, 0], issues: [], data: { c: 3 } },
        { path, index: [1, 1, 1], issues: [], data: { d: 4 } },
        { path, index: [2], issues: [], data: { e: 5 } }
      ]
    });
  });
});

describe("when file has syntax error", () => {
  beforeEach(async () => {
    await createTempFiles({
      "foo.js": "1x"
    });
  });

  test("should throw ResolveError", async () => {
    await expect(
      generate({ components: ["*"], path: tmpDir.path })
    ).rejects.toThrowWithMessage(
      GenerateError,
      "Component value resolve failed"
    );
  });
});

describe("multiple files", () => {
  beforeEach(async () => {
    await createTempFiles({
      "foo.js": "module.exports = {foo: 'bar'}",
      "bar.js": "module.exports = {}",
      "foo.json": stringify({ foo: "bar" })
    });
  });

  describe("when components is not wildcard", () => {
    test("should load files that match the pattern regardless the extension", async () => {
      const result = await generate({
        components: ["foo"],
        path: tmpDir.path
      });
      expect(result).toEqual({
        manifests: [
          {
            path: join(tmpDir.path, "foo.js"),
            index: [],
            issues: [],
            data: { foo: "bar" }
          },
          {
            path: join(tmpDir.path, "foo.json"),
            index: [],
            issues: [],
            data: { foo: "bar" }
          }
        ]
      });
    });
  });

  describe("when extensions are given", () => {
    test("should only load files that match the extensions", async () => {
      const result = await generate({
        components: ["*"],
        path: tmpDir.path,
        extensions: ["json"]
      });
      expect(result).toEqual({
        manifests: [
          {
            path: join(tmpDir.path, "foo.json"),
            index: [],
            issues: [],
            data: { foo: "bar" }
          }
        ]
      });
    });
  });
});

describe("when components is empty", () => {
  test("should throw GenerateError", async () => {
    await expect(
      generate({
        components: [],
        path: tmpDir.path
      })
    ).rejects.toThrowWithMessage(GenerateError, "components must not be empty");
  });
});

describe("when extensions is empty", () => {
  test("should throw GenerateError", async () => {
    await expect(
      generate({
        components: ["*"],
        path: tmpDir.path,
        extensions: []
      })
    ).rejects.toThrowWithMessage(GenerateError, "extensions must not be empty");
  });
});

describe("when extensions started with .", () => {
  test("should throw GenerateError", async () => {
    await expect(
      generate({
        components: ["*"],
        path: tmpDir.path,
        extensions: ["a", ".b", "c"]
      })
    ).rejects.toThrowWithMessage(
      GenerateError,
      `extension must not be started with ".": ".b"`
    );
  });
});

describe("when validate prop is not a function", () => {
  beforeEach(async () => {
    await createTempFiles({
      "a.js": "module.exports = {validate: 1}"
    });
  });

  test("should not execute validate function", async () => {
    const result = await generate({ components: ["*"], path: tmpDir.path });
    expect(result).toEqual({
      manifests: [
        {
          path: join(tmpDir.path, "a.js"),
          index: [],
          issues: [],
          data: { validate: 1 }
        }
      ]
    });
  });
});

describe("when validate function succeeds", () => {
  beforeEach(async () => {
    await createTempFiles({
      "a.js": `
const value = {};
Object.defineProperty(value, "validate", {
  enumerable: false,
  value: () => {
    value.data = 1;
  },
});
module.exports = value;`
    });
  });

  test("should execute validate function", async () => {
    const result = await generate({ components: ["*"], path: tmpDir.path });
    expect(result).toEqual({
      manifests: [
        {
          path: join(tmpDir.path, "a.js"),
          index: [],
          issues: [],
          data: { data: 1 }
        }
      ]
    });
  });

  test("should not execute validate function if validate = false", async () => {
    const result = await generate({
      components: ["*"],
      path: tmpDir.path,
      validate: false
    });
    expect(result).toEqual({
      manifests: [
        {
          path: join(tmpDir.path, "a.js"),
          index: [],
          issues: [],
          data: {}
        }
      ]
    });
  });
});

describe("when validate function throws an error", () => {
  beforeEach(async () => {
    await createTempFiles({
      "a.js": `
const value = {};
Object.defineProperty(value, "validate", {
  enumerable: false,
  value: () => {
    throw new Error("err");
  },
});
module.exports = value;`
    });
  });

  test("should report an issue", async () => {
    const result = await generate({ components: ["*"], path: tmpDir.path });

    expect(result).toEqual({
      manifests: [
        {
          path: join(tmpDir.path, "a.js"),
          index: [],
          issues: [
            {
              severity: "error",
              message: "Validation error",
              cause: new Error("err")
            }
          ],
          data: {}
        }
      ]
    });
  });

  test("should throw ResolveError when throwOnError = true", async () => {
    await expect(
      generate({ components: ["*"], path: tmpDir.path, throwOnError: true })
    ).rejects.toThrowWithMessage(ResolveError, "Validation error");
  });

  test("should not execute validate function if validate = false", async () => {
    const result = await generate({
      components: ["*"],
      path: tmpDir.path,
      validate: false
    });
    expect(result).toEqual({
      manifests: [
        {
          path: join(tmpDir.path, "a.js"),
          index: [],
          issues: [],
          data: {}
        }
      ]
    });
  });
});

describe("when validate function returns a resolved promise", () => {
  beforeEach(async () => {
    await createTempFiles({
      "a.js": `
const value = {};
Object.defineProperty(value, "validate", {
  enumerable: false,
  value: async () => {
    value.data = 1;
  },
});
module.exports = value;`
    });
  });

  test("should execute validate function", async () => {
    const result = await generate({ components: ["*"], path: tmpDir.path });
    expect(result).toEqual({
      manifests: [
        {
          path: join(tmpDir.path, "a.js"),
          index: [],
          issues: [],
          data: { data: 1 }
        }
      ]
    });
  });
});

describe("when validate function returns a rejected promise", () => {
  beforeEach(async () => {
    await createTempFiles({
      "a.js": "module.exports = { async validate() { throw new Error('err'); }}"
    });
  });

  test("should report an issue", async () => {
    const result = await generate({ components: ["*"], path: tmpDir.path });

    expect(result.manifests[0].issues).toEqual([
      {
        severity: "error",
        message: "Validation error",
        cause: new Error("err")
      }
    ]);
  });

  test("should throw ResolveError when throwOnError = true", async () => {
    await expect(
      generate({ components: ["*"], path: tmpDir.path, throwOnError: true })
    ).rejects.toThrowWithMessage(ResolveError, "Validation error");
  });
});

describe("when multiple components validation failed", () => {
  beforeEach(async () => {
    await createTempFiles({
      "a.js": `module.exports = { foo: "a" }`,
      "b.js": `module.exports = { validate: () => { throw new Error("b err"); } }`,
      "c.js": `module.exports = { validate: () => { throw new Error("c err"); } }`
    });
  });

  test("should report an issue for each component", async () => {
    const result = await generate({ components: ["*"], path: tmpDir.path });

    expect(result.manifests).toHaveLength(3);
    expect(result.manifests[0].issues).toBeEmpty();
    expect(result.manifests[1].issues).toEqual([
      {
        severity: "error",
        message: "Validation error",
        cause: new Error("b err")
      }
    ]);
    expect(result.manifests[2].issues).toEqual([
      {
        severity: "error",
        message: "Validation error",
        cause: new Error("c err")
      }
    ]);
  });

  test("should throw AggregateError when throwOnError = true", async () => {
    await expect(
      generate({
        components: ["*"],
        path: tmpDir.path,
        throwOnError: true
      })
    ).rejects.toThrow(AggregateError);
  });
});

describe("when concurrency < 1", () => {
  test("should throw an error", async () => {
    await expect(
      generate({
        components: ["*"],
        path: tmpDir.path,
        concurrency: 0
      })
    ).rejects.toThrow("Concurrency must be greater than 0");
  });
});

describe("when transform is given", () => {
  beforeEach(async () => {
    await createTempFiles({
      "a.js": "module.exports = {a: 1}"
    });
  });

  test("should transform the value", async () => {
    const result = await generate({
      components: ["*"],
      path: tmpDir.path,
      transform: (manifest) => ({ ...(manifest.data as any), b: 2 })
    });
    expect(result).toEqual({
      manifests: [
        {
          path: join(tmpDir.path, "a.js"),
          index: [],
          issues: [],
          data: { a: 1, b: 2 }
        }
      ]
    });
  });
});

describe("when validateManifest is given", () => {
  beforeEach(async () => {
    await createTempFiles({
      "a.js": "module.exports = {a: 1}"
    });
  });

  test("should call validateManifest", async () => {
    const validateManifest = jest.fn((manifest: ManifestToValidate) => {
      manifest.report({ severity: "error", message: "oops" });
    });
    const result = await generate({
      components: ["*"],
      path: tmpDir.path,
      validateManifest
    });

    expect(validateManifest).toHaveBeenCalledOnce();
    expect(result).toEqual({
      manifests: [
        {
          path: join(tmpDir.path, "a.js"),
          index: [],
          issues: [{ severity: "error", message: "oops" }],
          data: { a: 1 }
        }
      ]
    });
  });
});

describe("when validateAllManifests is given", () => {
  function validateAllManifests(manifests: readonly ManifestToValidate[]) {
    for (const manifest of manifests) {
      manifest.report({
        severity: "error",
        message: `validate error`
      });
    }
  }

  beforeEach(async () => {
    await createTempFiles({
      "a.js": "module.exports = {a: 1}",
      "b.js": "module.exports = {b: 2}"
    });
  });

  test("should call validateManifest", async () => {
    const result = await generate({
      components: ["*"],
      path: tmpDir.path,
      validateAllManifests
    });

    expect(result).toEqual({
      manifests: [
        {
          path: join(tmpDir.path, "a.js"),
          index: [],
          issues: [{ severity: "error", message: "validate error" }],
          data: { a: 1 }
        },
        {
          path: join(tmpDir.path, "b.js"),
          index: [],
          issues: [{ severity: "error", message: "validate error" }],
          data: { b: 2 }
        }
      ]
    });
  });

  test("should stop on the first issue when bail = true", async () => {
    const result = await generate({
      components: ["*"],
      path: tmpDir.path,
      validateAllManifests,
      bail: true
    });

    expect(result).toEqual({
      manifests: [
        {
          path: join(tmpDir.path, "a.js"),
          index: [],
          issues: [{ severity: "error", message: "validate error" }],
          data: { a: 1 }
        },
        {
          path: join(tmpDir.path, "b.js"),
          index: [],
          issues: [],
          data: { b: 2 }
        }
      ]
    });
  });

  test("should throw a ResolveError when throwOnError = true", async () => {
    const err = await getRejectedValue(
      generate({
        components: ["*"],
        path: tmpDir.path,
        validateAllManifests,
        throwOnError: true
      })
    );

    assert(err instanceof ResolveError);
    expect(err.message).toEqual("validate error");
    expect(err.path).toEqual(join(tmpDir.path, "a.js"));
    expect(err.index).toEqual([]);
    expect(err.value).toEqual({ a: 1 });
  });
});
