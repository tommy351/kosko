/// <reference types="jest-extended"/>
import { generate, GenerateOptions } from "../generate";
import tmp from "tmp-promise";
import { Result } from "../base";
import fs from "fs";
import { promisify } from "util";
import makeDir from "make-dir";
import { join, dirname } from "path";
import tempDir from "temp-dir";
import { getExtensions } from "../extensions";

const writeFile = promisify(fs.writeFile);

jest.mock("../extensions.ts");

interface File {
  path: string;
  content: string;
}

let tmpDir: tmp.DirectoryResult;
let tmpFiles: File[];
let options: Pick<GenerateOptions, Exclude<keyof GenerateOptions, "path">>;
let result: Result;

beforeEach(async () => {
  tmpDir = await tmp.dir({ dir: tempDir, unsafeCleanup: true });

  for (const file of tmpFiles) {
    const path = join(tmpDir.path, file.path);
    await makeDir(dirname(path));
    await writeFile(path, file.content);
  }

  (getExtensions as jest.Mock).mockImplementation(() => ["js", "json"]);

  result = await generate({
    ...options,
    path: tmpDir.path
  });
});

afterEach(async () => {
  tmpDir.cleanup();
});

describe("given the wildcard pattern", () => {
  beforeAll(() => {
    options = {
      components: ["*"]
    };
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
            data: { foo: "bar" }
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

    test("should return the return value of the function", () => {
      expect(result).toEqual({
        manifests: [
          {
            path: join(tmpDir.path, "foo.js"),
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

    test("should return the resolved value of the promise", () => {
      expect(result).toEqual({
        manifests: [
          {
            path: join(tmpDir.path, "foo.js"),
            data: { foo: "bar" }
          }
        ]
      });
    });
  });
});

describe("given a pattern without an extension", () => {
  beforeAll(() => {
    options = {
      components: ["foo"]
    };
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
            data: { foo: "bar" }
          }
        ]
      });
    });
  });
});

describe("given multiple patterns", () => {
  beforeAll(() => {
    options = {
      components: ["a*", "b*"]
    };
  });

  describe("and three files", () => {
    beforeAll(() => {
      tmpFiles = ["a", "b", "c"].map(x => ({
        path: `${x}.js`,
        content: `module.exports = {value: '${x}'}`
      }));
    });

    test("should load files matching the pattern", () => {
      expect(result.manifests).toIncludeAllMembers([
        {
          path: join(tmpDir.path, "a.js"),
          data: { value: "a" }
        },
        {
          path: join(tmpDir.path, "b.js"),
          data: { value: "b" }
        }
      ]);
    });
  });
});

describe("given extensions", () => {
  beforeAll(() => {
    options = {
      components: ["*"],
      extensions: ["foo", "bar"]
    };

    tmpFiles = [
      { path: "a.foo", content: "module.exports = {foo: 'a'}" },
      { path: "b.bar", content: "module.exports = {bar: 'b'}" },
      { path: "c.js", content: "module.exports = {}" }
    ];
  });

  test("should load files with the given extensions", () => {
    expect(result.manifests).toIncludeAllMembers([
      {
        path: join(tmpDir.path, "a.foo"),
        data: { foo: "a" }
      },
      {
        path: join(tmpDir.path, "b.bar"),
        data: { bar: "b" }
      }
    ]);
  });
});
