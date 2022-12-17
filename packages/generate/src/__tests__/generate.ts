/// <reference types="jest-extended"/>
import { generate } from "../generate";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { GenerateError, ResolveError } from "../error";
import { makeTempDir, TempDir } from "@kosko/test-utils";
import AggregateError from "@kosko/aggregate-error";
import stringify from "fast-safe-stringify";

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
          data: { foo: 1 }
        },
        {
          path: join(tmpDir.path, "foo.js"),
          index: [1],
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
        { path, index: [0], data: { a: 1 } },
        { path, index: [1, 0], data: { b: 2 } },
        { path, index: [1, 1, 0], data: { c: 3 } },
        { path, index: [1, 1, 1], data: { d: 4 } },
        { path, index: [2], data: { e: 5 } }
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
            data: { foo: "bar" }
          },
          {
            path: join(tmpDir.path, "foo.json"),
            index: [],
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

  test("should throw ResolveError", async () => {
    await expect(
      generate({ components: ["*"], path: tmpDir.path })
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

  test("should throw ResolveError", async () => {
    await expect(
      generate({ components: ["*"], path: tmpDir.path })
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

  test("should throw AggregateError", async () => {
    await expect(
      generate({
        components: ["*"],
        path: tmpDir.path
      })
    ).rejects.toThrow(AggregateError);
  });

  test("should throw ResolveError if bail = true", async () => {
    await expect(
      generate({
        components: ["*"],
        path: tmpDir.path,
        bail: true
      })
    ).rejects.toThrowWithMessage(ResolveError, "Validation error");
  });
});
