import execa from "execa";
import { copyFile, readFile } from "fs-extra";
import { join } from "path";
import tempDir from "temp-dir";
import tmp from "tmp-promise";
import { installPackage } from "../../run";

let args: string[];
let result: execa.ExecaReturnValue;
let options: execa.Options;
let tmpDir: tmp.DirectoryResult;

beforeEach(async () => {
  tmpDir = await tmp.dir({ tmpdir: tempDir, unsafeCleanup: true });

  const src = join(__dirname, "..", "bin.js");
  const dst = join(tmpDir.path, "bin.js");
  await copyFile(src, dst);
  await installPackage(tmpDir.path, "template");

  result = await execa(dst, args, {
    ...options,
    cwd: tmpDir.path,
    env: {
      LC_ALL: "en_US"
    }
  });
});

afterEach(async () => {
  await tmpDir.cleanup();
});

async function readFiles(cwd: string): Promise<string[]> {
  return Promise.all(
    ["foo", "bar/baz"].map((path) => readFile(join(cwd, path), "utf8"))
  );
}

describe("given args --help", () => {
  beforeAll(() => {
    args = ["--help"];
    options = {};
  });

  test("should return status code 0", () => {
    expect(result.exitCode).toEqual(0);
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
    expect(result.exitCode).toEqual(1);
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
    expect(result.exitCode).toEqual(0);
  });

  test("should write files to process.cwd", async () => {
    await expect(readFiles(tmpDir.path)).resolves.toMatchSnapshot();
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
    expect(result.exitCode).toEqual(0);
  });

  test("should write files to specified path", async () => {
    await expect(readFiles(cwd)).resolves.toMatchSnapshot();
  });
});
