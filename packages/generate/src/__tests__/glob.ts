/// <reference types="jest-extended"/>
import { makeTempDir, TempDir } from "@kosko/test-utils";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { glob } from "../glob";

let tmpDir: TempDir;

async function collectAsyncIterable<T>(
  iterable: AsyncIterable<T>
): Promise<T[]> {
  const result: T[] = [];

  for await (const value of iterable) {
    result.push(value);
  }

  return result;
}

beforeEach(async () => {
  tmpDir = await makeTempDir();

  const files = [
    "abc.js",
    "abc.txt",
    "abd.js",
    "bcd.js",
    "cde.js",
    "def/abc.js",
    "def/xyz.js"
  ];

  for (const file of files) {
    const path = join(tmpDir.path, file);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, "");
  }
});

afterEach(async () => {
  await tmpDir.cleanup();
});

describe.each([
  { patterns: ["a*"], extensions: ["js"], expected: ["abc.js", "abd.js"] },
  {
    patterns: ["a*", "*d"],
    extensions: ["js"],
    expected: ["abc.js", "abd.js", "bcd.js"]
  },
  { patterns: ["a*"], extensions: ["txt"], expected: ["abc.txt"] },
  {
    patterns: ["a*"],
    extensions: ["js", "txt"],
    expected: ["abc.js", "abc.txt", "abd.js"]
  },
  { patterns: ["d*"], extensions: ["js"], expected: ["def"] },
  {
    patterns: ["d*/*"],
    extensions: ["js"],
    expected: ["def/abc.js", "def/xyz.js"]
  },
  {
    patterns: ["*"],
    extensions: ["js"],
    expected: ["abc.js", "abd.js", "bcd.js", "cde.js", "def"]
  },
  {
    patterns: ["*", "!bcd"],
    extensions: ["js"],
    expected: ["abc.js", "abd.js", "cde.js", "def"]
  },
  {
    patterns: ["*", "!def"],
    extensions: ["js"],
    expected: ["abc.js", "abd.js", "bcd.js", "cde.js"]
  }
])(
  "patterns = $patterns, extensions = $extensions",
  ({ expected, ...options }) => {
    test(`returns [${expected.join(", ")}]`, async () => {
      const actual = await collectAsyncIterable(
        glob({ ...options, path: tmpDir.path })
      );
      expect(actual).toIncludeSameMembers(
        expected.map((path) => ({
          relativePath: path,
          absolutePath: join(tmpDir.path, path)
        }))
      );
    });
  }
);
