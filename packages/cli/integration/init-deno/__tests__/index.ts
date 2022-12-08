import { makeTempDir, TempDir } from "@kosko/test-utils";
import glob from "fast-glob";
import { join, posix } from "node:path";
import { readFile } from "node:fs/promises";
import { runDenoCLI } from "../../utils/run";
import { ExecaReturnValue } from "execa";
import replaceString from "replace-string";

let tmpDir: TempDir;
let result: ExecaReturnValue;

beforeEach(async () => {
  tmpDir = await makeTempDir();
  result = await runDenoCLI(["init", tmpDir.path]);
});

afterEach(async () => {
  await tmpDir.cleanup();
});

test("should setup a new folder", async () => {
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

test("should print usage guide to console", () => {
  expect(
    replaceString(result.stderr, tmpDir.path, "<INIT_PATH>")
  ).toMatchSnapshot();
});
