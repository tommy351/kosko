import execa from "execa";
import tmp from "tmp-promise";
import { runCLI } from "../../run";
import fs from "fs";
import { promisify } from "util";
import { join } from "path";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

let result: execa.ExecaReturns;
let tmpDir: tmp.DirectoryResult;

beforeAll(async () => {
  tmpDir = await tmp.dir({ unsafeCleanup: true });
  await writeFile(
    join(tmpDir.path, "test.js"),
    `
exports.options = {
  foo: {}
};

exports.generate = (options) => ({ files: [
  { path: "foo/bar", content: options.foo }
] })`
  );
  result = await runCLI(["new", "./test", "--foo", "bar"], {
    cwd: tmpDir.path
  });
});

test("should return status code 0", () => {
  expect(result.code).toEqual(0);
});

test("should create files based on templates", async () => {
  const content = await readFile(join(tmpDir.path, "foo", "bar"), "utf8");
  expect(content).toEqual("bar");
});
