import execa from "execa";
import { join } from "path";
import tmp from "tmp-promise";
import { runCLI } from "../../run";
import symlinkDir from "symlink-dir";
import pkgDir from "pkg-dir";
import fs from "fs";
import { promisify } from "util";

const readFile = promisify(fs.readFile);

let result: execa.ExecaReturns;
let tmpDir: tmp.DirectoryResult;

beforeAll(async () => {
  const root = await pkgDir();
  tmpDir = await tmp.dir({ unsafeCleanup: true });
  await symlinkDir(
    join(root!, "packages/template-environment"),
    join(tmpDir.path, "node_modules", "@kosko", "template-environment")
  );
  result = await runCLI(
    ["new", "@kosko/template-environment", "--name", "dev"],
    { cwd: tmpDir.path }
  );
});

afterAll(() => tmpDir.cleanup());

test("should return status code 0", () => {
  expect(result.code).toEqual(0);
});

test("should create files based on templates", async () => {
  const content = await readFile(
    join(tmpDir.path, "environments", "dev", "index.js"),
    "utf8"
  );
  expect(content).toMatchSnapshot();
});
