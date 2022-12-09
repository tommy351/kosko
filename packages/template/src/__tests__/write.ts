import { makeTempDir, TempDir } from "@kosko/test-utils";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { File } from "../template";
import { writeFiles } from "../write";

jest.mock("@kosko/log");

let tmpDir: TempDir;
let files: File[];

function readTmpFile(path: string): Promise<string> {
  return readFile(join(tmpDir.path, path), "utf8");
}

beforeEach(async () => {
  tmpDir = await makeTempDir();
  await writeFiles(tmpDir.path, files);
});

afterEach(async () => {
  await tmpDir.cleanup();
});

describe("given files", () => {
  beforeAll(() => {
    files = [
      { path: "foo", content: "bar" },
      { path: "bar/baz", content: "baz" }
    ];
  });

  test("should write foo", async () => {
    expect(await readTmpFile("foo")).toEqual("bar");
  });

  test("should write bar/baz", async () => {
    expect(await readTmpFile("bar/baz")).toEqual("baz");
  });
});
