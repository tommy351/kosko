/// <reference types="jest-extended"/>
import { generate } from "../generate";
import tmp from "tmp-promise";
import { Result } from "../base";
import fs from "fs";
import { promisify } from "util";
import makeDir from "make-dir";
import { join, dirname } from "path";
import tempDir from "temp-dir";
import { getExtensions } from "../extensions";
import { ValidationError } from "../error";

const writeFile = promisify(fs.writeFile);

jest.mock("../extensions.ts");

interface File {
  path: string;
  content: string;
}

let tmpDir: tmp.DirectoryResult;
let tmpFiles: File[];

beforeEach(async () => {
  tmpDir = await tmp.dir({ tmpdir: tempDir, unsafeCleanup: true });

  for (const file of tmpFiles) {
    const path = join(tmpDir.path, file.path);
    await makeDir(dirname(path));
    await writeFile(path, file.content);
  }

  (getExtensions as jest.Mock).mockImplementation(() => ["js", "json"]);
});

afterEach(async () => {
  tmpDir.cleanup();
});

describe("given the wildcard pattern", () => {
  let result: Result;

  beforeEach(async () => {
    result = await generate({
      components: ["*"],
      path: tmpDir.path
    });
  });

  describe("and one file", () => {
    beforeAll(() => {
      tmpFiles = [{ path: "foo.js", content: "module.exports = {foo: 'bar'}" }];
    });

    test("should load the one in the components folder", () => {
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

  describe("and one folder", () => {
    beforeAll(() => {
      tmpFiles = [
        {
          path: "foo/index.js",
          content: "module.exports = {foo: 'bar'}"
        }
      ];
    });

    test("should load the one in the components folder", () => {
      expect(result).toEqual({
        manifests: [
          {
            path: join(tmpDir.path, "foo", "index.js"),
            index: [],
            data: { foo: "bar" }
          }
        ]
      });
    });
  });

  describe("when the script is a ES module", () => {
    beforeAll(() => {
      tmpFiles = [
        {
          path: "foo.js",
          content: `
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {foo: "bar"};`
        }
      ];
    });

    test("should return the default", () => {
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

  describe("when the script returns an array", () => {
    beforeAll(() => {
      tmpFiles = [
        {
          path: "foo.js",
          content: "module.exports = [{foo: 1}, {bar: 2}]"
        }
      ];
    });

    test("should return the array", () => {
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

  describe("when the script returns a function", () => {
    beforeAll(() => {
      tmpFiles = [
        {
          path: "foo.js",
          content: 'module.exports = () => ({ foo: "bar" })'
        }
      ];
    });

    test("should return the function return value", () => {
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

  describe("when the script returns a promise", () => {
    beforeAll(() => {
      tmpFiles = [
        {
          path: "foo.js",
          content: 'module.exports = () => Promise.resolve({ foo: "bar" })'
        }
      ];
    });

    test("should return the promise resolved value", () => {
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

  describe("when the script returns a nested array", () => {
    beforeAll(() => {
      tmpFiles = [
        {
          path: "foo.js",
          content: `
            module.exports = [
              {a: 1},
              [
                {b: 2},
                [{c: 3}, {d: 4}]
              ],
              {e: 5}
            ];
          `
        }
      ];
    });

    test("should return the flattened array", () => {
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

  describe("when the script returns an array containing a function", () => {
    beforeAll(() => {
      tmpFiles = [
        {
          path: "foo.js",
          content: `
            module.exports = [
              {a: 1},
              // Returns an object
              () => ({b: 2}),
              // Returns an array
              () => [{c: 3}, {d: 4}],
              // Returns an promise
              async () => ({e: 5}),
              // Returns an promise returning an array
              async () => [{f: 6}, {g: 7}]
            ]`
        }
      ];
    });

    test("should return the flattened array", () => {
      const path = join(tmpDir.path, "foo.js");

      expect(result).toEqual({
        manifests: [
          { path, index: [0], data: { a: 1 } },
          { path, index: [1], data: { b: 2 } },
          { path, index: [2, 0], data: { c: 3 } },
          { path, index: [2, 1], data: { d: 4 } },
          { path, index: [3], data: { e: 5 } },
          { path, index: [4, 0], data: { f: 6 } },
          { path, index: [4, 1], data: { g: 7 } }
        ]
      });
    });
  });
});

describe("given a pattern without an extension", () => {
  let result: Result;

  beforeEach(async () => {
    result = await generate({
      components: ["foo"],
      path: tmpDir.path
    });
  });

  describe("and two JS files", () => {
    beforeAll(() => {
      tmpFiles = [
        { path: "foo.js", content: "module.exports = {foo: 'bar'}" },
        { path: "bar.js", content: "module.exports = {}" }
      ];
    });

    test("should load the one matching the pattern", () => {
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

  describe("and one JSON file", () => {
    beforeAll(() => {
      tmpFiles = [{ path: "foo.json", content: `{"foo": "bar"}` }];
    });

    test("should load the one matching the pattern", () => {
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

describe("given multiple patterns", () => {
  let result: Result;

  beforeEach(async () => {
    result = await generate({
      components: ["a*", "b*"],
      path: tmpDir.path
    });
  });

  describe("and three files", () => {
    beforeAll(() => {
      tmpFiles = ["a", "b", "c"].map((x) => ({
        path: `${x}.js`,
        content: `module.exports = {value: '${x}'}`
      }));
    });

    test("should load files matching the pattern", () => {
      expect(result.manifests).toIncludeAllMembers([
        {
          path: join(tmpDir.path, "a.js"),
          index: [],
          data: { value: "a" }
        },
        {
          path: join(tmpDir.path, "b.js"),
          index: [],
          data: { value: "b" }
        }
      ]);
    });
  });
});

describe("given extensions", () => {
  beforeAll(() => {
    tmpFiles = [
      { path: "a.foo", content: "module.exports = {foo: 'a'}" },
      { path: "b.bar", content: "module.exports = {bar: 'b'}" },
      { path: "c.js", content: "module.exports = {}" }
    ];
  });

  let result: Result;

  beforeEach(async () => {
    result = await generate({
      components: ["*"],
      extensions: ["foo", "bar"],
      path: tmpDir.path
    });
  });

  test("should load files with the given extensions", () => {
    expect(result.manifests).toIncludeAllMembers([
      {
        path: join(tmpDir.path, "a.foo"),
        index: [],
        data: { foo: "a" }
      },
      {
        path: join(tmpDir.path, "b.bar"),
        index: [],
        data: { bar: "b" }
      }
    ]);
  });
});

describe("given validate = true", () => {
  function execute(): Promise<Result> {
    return generate({
      components: ["*"],
      path: tmpDir.path,
      validate: true
    });
  }

  describe("when validate is undefined", () => {
    beforeAll(() => {
      tmpFiles = [{ path: "foo.js", content: "module.exports = {}" }];
    });

    test("should be ok", async () => {
      expect(await execute()).toEqual({
        manifests: [
          {
            path: join(tmpDir.path, "foo.js"),
            index: [],
            data: {}
          }
        ]
      });
    });
  });

  describe("when validate is not a function", () => {
    beforeAll(() => {
      tmpFiles = [
        { path: "foo.js", content: "module.exports = {validate: 1}" }
      ];
    });

    test("should be ok", async () => {
      expect(await execute()).toEqual({
        manifests: [
          {
            path: join(tmpDir.path, "foo.js"),
            index: [],
            data: { validate: 1 }
          }
        ]
      });
    });
  });

  describe("when validate is a function", () => {
    beforeAll(() => {
      tmpFiles = [
        {
          path: "foo.js",
          content: `
class Validator {
  validate() { this.foo = 1; }
}
module.exports = new Validator();
`
        }
      ];
    });

    test("should be ok", async () => {
      expect(await execute()).toEqual({
        manifests: [
          {
            path: join(tmpDir.path, "foo.js"),
            index: [],
            data: { foo: 1 }
          }
        ]
      });
    });
  });

  describe("when validate throws an error", () => {
    beforeAll(() => {
      tmpFiles = [
        {
          path: "foo.js",
          content:
            "module.exports = {validate: () => { throw new Error('err'); }}"
        }
      ];
    });

    test("should throw ValidationError", async () => {
      await expect(execute()).rejects.toThrow(ValidationError);
    });
  });

  describe("when validate returns a promise", () => {
    beforeAll(() => {
      tmpFiles = [
        {
          path: "foo.js",
          content: `
class Validator {
  async validate() { this.foo = 1; }
}
module.exports = new Validator();
`
        }
      ];
    });

    test("should be ok", async () => {
      expect(await execute()).toEqual({
        manifests: [
          {
            path: join(tmpDir.path, "foo.js"),
            index: [],
            data: { foo: 1 }
          }
        ]
      });
    });
  });

  describe("when validate returns a rejected promise", () => {
    beforeAll(() => {
      tmpFiles = [
        {
          path: "foo.js",
          content:
            "module.exports = {validate: () => Promise.reject(new Error('foo'))}"
        }
      ];
    });

    test("should throw ValidationError", async () => {
      await expect(execute()).rejects.toThrow(ValidationError);
    });
  });
});
