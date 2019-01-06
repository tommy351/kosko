import execa from "execa";
import { join } from "path";
import tmp from "tmp-promise";
import fs from "fs";
import { promisify } from "util";
import symlinkDir from "symlink-dir";
import pkgDir from "pkg-dir";

const copyFile = promisify(fs.copyFile);
const readFile = promisify(fs.readFile);

let args: string[];
let result: execa.ExecaReturns;
let options: execa.Options;
let tmpDir: tmp.DirectoryResult;

beforeEach(async () => {
  const root = await pkgDir();
  tmpDir = await tmp.dir({ unsafeCleanup: true });

  const src = join(__dirname, "..", "bin.js");
  const dst = join(tmpDir.path, "bin.js");
  await copyFile(src, dst);

  await symlinkDir(
    join(root!, "packages", "template"),
    join(tmpDir.path, "node_modules", "@kosko", "template")
  );

  result = await execa(dst, args, {
    ...options,
    cwd: tmpDir.path
  });
});

afterEach(() => tmpDir.cleanup());

async function assertFiles(cwd: string) {
  const paths = ["foo", "bar/baz"];

  for (const path of paths) {
    const content = await readFile(join(cwd, path), "utf8");
    expect(content).toMatchSnapshot();
  }
}

describe("given args --help", () => {
  beforeAll(() => {
    args = ["--help"];
    options = {};
  });

  test("should return status code 0", () => {
    expect(result.code).toEqual(0);
  });

  test("should print help", () => {
    expect(result.stdout).toMatchSnapshot();
  });
});

describe("when required arg is not given", () => {
  beforeAll(() => {
    args = [];
    options = { reject: false };
  });

  test("should return status code 1", () => {
    expect(result.code).toEqual(1);
  });

  test("should print error", () => {
    expect(result.stderr).toMatchSnapshot();
  });
});

describe("when cwd is not set", () => {
  beforeAll(() => {
    args = ["--foo", "bar", "--bar", "46.93"];
    options = {};
  });

  test("should return status code 0", () => {
    expect(result.code).toEqual(0);
  });

  test("should write files to process.cwd", async () => {
    await assertFiles(tmpDir.path);
  });
});

describe("when cwd is set", () => {
  let cwd: string;

  beforeAll(() => {
    cwd = join(tmpDir.path, "foo");
    args = ["--foo", "bar", "--bar", "46.93", "--cwd", cwd];
    options = {};
  });

  test("should return status code 0", () => {
    expect(result.code).toEqual(0);
  });

  test("should write files to specified path", async () => {
    await assertFiles(cwd);
  });
});
