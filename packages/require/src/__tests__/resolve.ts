import { resolve } from "../resolve";
import { makeTempDir, TempDir } from "@kosko/test-utils";
import { dirname, join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { getRequireExtensions } from "../extensions";

jest.mock("../extensions");

beforeEach(() => {
  jest.mocked(getRequireExtensions).mockReturnValue([".js", ".json"]);
});

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
  { input: "foo", files: ["foo.js/index.js"], expected: undefined }
])(
  `when input = "$input" and existing files are $files`,
  ({ input, files, expected }) => {
    let tmpDir: TempDir;

    beforeEach(async () => {
      tmpDir = await makeTempDir();

      for (const file of files) {
        const path = join(tmpDir.path, file);

        await mkdir(dirname(path), { recursive: true });
        await writeFile(path, "");
      }
    });

    afterEach(async () => {
      await tmpDir.cleanup();
    });

    test(`returns ${JSON.stringify(expected)}`, async () => {
      const actual = await resolve(input, { baseDir: tmpDir.path });
      const absExpected = expected && join(tmpDir.path, expected);

      expect(actual).toEqual(absExpected);
    });
  }
);

describe("when extensions are given", () => {
  let tmpDir: TempDir;

  beforeEach(async () => {
    tmpDir = await makeTempDir();

    for (const ext of ["js", "abc"]) {
      await writeFile(join(tmpDir.path, `foo.${ext}`), "");
    }
  });

  afterEach(async () => {
    await tmpDir.cleanup();
  });

  test("returns path with custom extensions", async () => {
    const actual = await resolve("foo", {
      baseDir: tmpDir.path,
      extensions: [".abc"]
    });

    expect(actual).toEqual(join(tmpDir.path, "foo.abc"));
  });
});
