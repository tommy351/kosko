import tmpPromise from "tmp-promise";
import { writeFiles } from "../write";
import { File } from "../template";
import fs from "fs";
import { promisify } from "util";
import { join } from "path";

const readFile = promisify(fs.readFile);

let tmpDir: tmpPromise.DirectoryResult;
let files: File[];

function readTmpFile(path: string) {
  return readFile(join(tmpDir.path, path), "utf8");
}

beforeEach(async () => {
  tmpDir = await tmpPromise.dir({ unsafeCleanup: true });
  await writeFiles(tmpDir.path, files);
});

afterEach(() => tmpDir.cleanup());

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
