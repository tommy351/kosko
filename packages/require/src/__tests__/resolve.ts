import { resolveModule, resolvePath } from "../resolve";
import { makeTempDir, TempDir } from "@kosko/test-utils";
import { dirname, join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { getRequireExtensions } from "../extensions";

jest.mock("../extensions");

let tmpDir: TempDir;

async function makeFiles(files: readonly string[]) {
  for (const file of files) {
    const path = join(tmpDir.path, file);

    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, "");
  }
}

beforeEach(async () => {
  jest.mocked(getRequireExtensions).mockReturnValue([".js", ".json"]);

  tmpDir = await makeTempDir();
});

afterEach(async () => {
  await tmpDir.cleanup();
});

describe("resolvePath", () => {
  describe.each([
    { input: "foo", files: ["foo.js"], expected: "foo.js" },
    { input: "foo", files: [], expected: undefined },
    { input: "foo", files: ["foo.json"], expected: "foo.json" },
    { input: "foo", files: ["foo.js", "foo.json"], expected: "foo.js" },
    { input: "foo.js", files: ["foo.js", "foo.json"], expected: "foo.js" },
    { input: "foo", files: ["foo/index.js"], expected: "foo/index.js" },
    { input: "foo", files: ["foo/index.json"], expected: "foo/index.json" },
    {
      input: "foo",
      files: ["foo/index.js", "foo/index.json"],
      expected: "foo/index.js"
    },
    { input: "foo", files: ["foo.js", "foo/index.js"], expected: "foo.js" },
    { input: "foo", files: ["foo/bar.js"], expected: undefined },
    { input: "foo", files: ["foo.js/index.js"], expected: undefined },
    { input: "./foo", files: ["foo.js"], expected: "foo.js" }
  ])(
    `when input = "$input" and existing files are $files`,
    ({ input, files, expected }) => {
      beforeEach(async () => {
        await makeFiles(files);
      });

      test(`returns ${JSON.stringify(expected)}`, async () => {
        const actual = await resolvePath(input, { baseDir: tmpDir.path });
        const absExpected = expected && join(tmpDir.path, expected);

        expect(actual).toEqual(absExpected);
      });
    }
  );

  describe("when extensions are given", () => {
    beforeEach(async () => {
      for (const ext of ["js", "abc"]) {
        await writeFile(join(tmpDir.path, `foo.${ext}`), "");
      }
    });

    test("returns path with custom extensions", async () => {
      const actual = await resolvePath("foo", {
        baseDir: tmpDir.path,
        extensions: [".abc"]
      });

      expect(actual).toEqual(join(tmpDir.path, "foo.abc"));
    });
  });

  describe("when path is absolute", () => {
    test("returns path if it exists", async () => {
      const path = join(tmpDir.path, "foo.js");
      await writeFile(path, "");
      const actual = await resolvePath(path);
      expect(actual).toEqual(path);
    });

    test("returns undefined if path does not exist", async () => {
      const path = join(tmpDir.path, "foo.js");
      const actual = await resolvePath(path);
      expect(actual).toBeUndefined();
    });
  });
});

describe("resolveModule", () => {
  describe("relative path", () => {
    test("returns path if it exists", async () => {
      await makeFiles(["file.js"]);
      const actual = await resolveModule("./file.js", { baseDir: tmpDir.path });
      expect(actual).toEqual(join(tmpDir.path, "file.js"));
    });

    test("returns undefined if path does not exist", async () => {
      const actual = await resolveModule("./missing.js", {
        baseDir: tmpDir.path
      });
      expect(actual).toBeUndefined();
    });

    test("returns index.js if path is a directory", async () => {
      await makeFiles(["dir/index.js"]);
      const actual = await resolveModule("./dir", { baseDir: tmpDir.path });
      expect(actual).toEqual(join(tmpDir.path, "dir/index.js"));
    });

    test("returns path even if extension is not given", async () => {
      await makeFiles(["file.js"]);
      const actual = await resolveModule("./file", { baseDir: tmpDir.path });
      expect(actual).toEqual(join(tmpDir.path, "file.js"));
    });
  });

  describe("absolute path", () => {
    test("returns path if it exists", async () => {
      await makeFiles(["file.js"]);
      const actual = await resolveModule(join(tmpDir.path, "file.js"));
      expect(actual).toEqual(join(tmpDir.path, "file.js"));
    });

    test("returns undefined if path does not exist", async () => {
      const actual = await resolveModule(join(tmpDir.path, "missing.js"));
      expect(actual).toBeUndefined();
    });

    test("returns index.js if path is a directory", async () => {
      await makeFiles(["dir/index.js"]);
      const actual = await resolveModule(join(tmpDir.path, "dir"));
      expect(actual).toEqual(join(tmpDir.path, "dir/index.js"));
    });
  });

  test("returns undefined if module does not exist", async () => {
    const actual = await resolveModule("missing", { baseDir: tmpDir.path });
    expect(actual).toBeUndefined();
  });

  describe("CJS module", () => {
    beforeEach(async () => {
      await makeFiles(["node_modules/foo/bar.js"]);
      await writeFile(
        join(tmpDir.path, "node_modules/foo/package.json"),
        JSON.stringify({ main: "bar.js" })
      );
    });

    test("returns path if module exists", async () => {
      const actual = await resolveModule("foo", { baseDir: tmpDir.path });
      expect(actual).toEqual(join(tmpDir.path, "node_modules/foo/bar.js"));
    });
  });

  describe("ESM module", () => {
    beforeEach(async () => {
      await makeFiles(["node_modules/foo/bar.js"]);
      await writeFile(
        join(tmpDir.path, "node_modules/foo/package.json"),
        JSON.stringify({
          type: "module",
          exports: {
            "./foo": "./bar.js",
            ".": "./bar.js"
          }
        })
      );
    });

    test("returns path if module exists", async () => {
      const actual = await resolveModule("foo", { baseDir: tmpDir.path });
      expect(actual).toEqual(join(tmpDir.path, "node_modules/foo/bar.js"));
    });

    test("resolves export map", async () => {
      const actual = await resolveModule("foo/foo", { baseDir: tmpDir.path });
      expect(actual).toEqual(join(tmpDir.path, "node_modules/foo/bar.js"));
    });
  });
});
