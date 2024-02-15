import { TempDir, makeTempDir, projectRoot, runCLI } from "@kosko/test-utils";
import execa from "execa";
import { join } from "node:path";
import { listAllFiles } from "../../../src/test-utils";

const BIN_PATH = join(projectRoot, "packages/create-kosko/bin/create-kosko.js");

let tmpDir: TempDir;

function run(args: readonly string[], options?: execa.Options) {
  return runCLI(BIN_PATH, args, options);
}

beforeEach(async () => {
  tmpDir = await makeTempDir();
});

afterEach(() => tmpDir.cleanup());

describe("when target is an empty folder", () => {
  test("should write files to the target path", async () => {
    await run([tmpDir.path, "--install", "false"]);

    const files = await listAllFiles(tmpDir.path);
    expect(files).toMatchSnapshot();
  });
});
