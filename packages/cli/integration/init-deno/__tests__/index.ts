import { makeTempDir, TempDir } from "@kosko/test-utils";
import glob from "fast-glob";
import { join, posix } from "node:path";
import { readFile } from "node:fs/promises";
import { runDenoCLI } from "../../utils/run";

let tmpDir: TempDir;

beforeEach(async () => {
  tmpDir = await makeTempDir();
});

afterEach(async () => {
  await tmpDir.cleanup();
});

test("should setup a new folder", async () => {
  await runDenoCLI(["init", tmpDir.path]);

  const paths = await glob("**/*", { cwd: tmpDir.path });
  const files: Record<string, string> = {};

  for (const path of paths) {
    files[posix.normalize(path)] = await readFile(
      join(tmpDir.path, path),
      "utf8"
    );
  }

  expect(files).toMatchSnapshot();
});
