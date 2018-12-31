/// <reference types="jest-extended"/>
import { generate } from "../generate";
import tmpPromise from "tmp-promise";
import { Result } from "../base";
import fs from "fs";
import { promisify } from "util";
import makeDir from "make-dir";
import { join, dirname } from "path";

const writeFile = promisify(fs.writeFile);

jest.mock("../requireExtensions.ts", () => ({
  ".js": {},
  ".json": {}
}));

interface File {
  path: string;
  content: string;
}

let tmpDir: tmpPromise.DirectoryResult;
let tmpFiles: File[];
let components: string[];
let result: Result;

beforeEach(async () => {
  tmpDir = await tmpPromise.dir({ unsafeCleanup: true });

  for (const file of tmpFiles) {
    const path = join(tmpDir.path, file.path);
    await makeDir(dirname(path));
    await writeFile(path, file.content);
  }

  result = await generate({
    path: tmpDir.path,
    components
  });
});

afterEach(async () => {
  tmpDir.cleanup();
});

describe("given the wildcard pattern", () => {
  beforeAll(() => {
    components = ["*"];
  });

  describe("and one files in the components folder and the other outside", () => {
    beforeAll(() => {
      tmpFiles = [
        { path: "foo.js", content: "module.exports = {}" },
        { path: "components/foo.js", content: "module.exports = {foo: 'bar'}" }
      ];
    });

    test("should load the one in the components folder", () => {
      expect(result).toEqual({
        resources: [
          {
            path: join(tmpDir.path, "components", "foo.js"),
            data: { foo: "bar" }
          }
        ]
      });
    });
  });

  describe("and a folder in the components folder", () => {
    beforeAll(() => {
      tmpFiles = [
        {
          path: "components/foo/index.js",
          content: "module.exports = {foo: 'bar'}"
        }
      ];
    });

    test("should load the one in the components folder", () => {
      expect(result).toEqual({
        resources: [
          {
            path: join(tmpDir.path, "components", "foo", "index.js"),
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
          path: "components/foo.js",
          content: `
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {foo: "bar"};`
        }
      ];
    });

    test("should return the default", () => {
      expect(result).toEqual({
        resources: [
          {
            path: join(tmpDir.path, "components", "foo.js"),
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
          path: "components/foo.js",
          content: 'module.exports = () => ({ foo: "bar" })'
        }
      ];
    });

    test("should return the return value of the function", () => {
      expect(result).toEqual({
        resources: [
          {
            path: join(tmpDir.path, "components", "foo.js"),
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
          path: "components/foo.js",
          content: 'module.exports = () => Promise.resolve({ foo: "bar" })'
        }
      ];
    });

    test("should return the resolved value of the promise", () => {
      expect(result).toEqual({
        resources: [
          {
            path: join(tmpDir.path, "components", "foo.js"),
            data: { foo: "bar" }
          }
        ]
      });
    });
  });
});

describe("given a pattern without an extension", () => {
  beforeAll(() => {
    components = ["foo"];
  });

  describe("and two JS files", () => {
    beforeAll(() => {
      tmpFiles = [
        { path: "components/foo.js", content: "module.exports = {foo: 'bar'}" },
        { path: "components/bar.js", content: "module.exports = {}" }
      ];
    });

    test("should load the one matching the pattern", () => {
      expect(result).toEqual({
        resources: [
          {
            path: join(tmpDir.path, "components", "foo.js"),
            data: { foo: "bar" }
          }
        ]
      });
    });
  });

  describe("and one JSON file", () => {
    beforeAll(() => {
      tmpFiles = [{ path: "components/foo.json", content: `{"foo": "bar"}` }];
    });

    test("should load the one matching the pattern", () => {
      expect(result).toEqual({
        resources: [
          {
            path: join(tmpDir.path, "components", "foo.json"),
            data: { foo: "bar" }
          }
        ]
      });
    });
  });
});

describe("given multiple patterns", () => {
  beforeAll(() => {
    components = ["a*", "b*"];
  });

  describe("and three files", () => {
    beforeAll(() => {
      tmpFiles = ["a", "b", "c"].map(x => ({
        path: `components/${x}.js`,
        content: `module.exports = {value: '${x}'}`
      }));
    });

    test("should load files matching the pattern", () => {
      expect(result.resources).toIncludeAllMembers([
        {
          path: join(tmpDir.path, "components", "a.js"),
          data: { value: "a" }
        },
        {
          path: join(tmpDir.path, "components", "b.js"),
          data: { value: "b" }
        }
      ]);
    });
  });
});
