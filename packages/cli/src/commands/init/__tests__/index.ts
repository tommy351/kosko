/// <reference types="jest-extended"/>
import { InitArguments, initCmd } from "../index";
import tempDir from "temp-dir";
import tmp from "tmp-promise";
import fs from "fs";
import { join, posix } from "path";
import glob from "fast-glob";
import { spawn } from "@kosko/exec-utils";

let tmpDir: tmp.DirectoryResult;

jest.mock("@kosko/log");
jest.mock("@kosko/exec-utils");

async function execute(args: Partial<InitArguments>): Promise<void> {
  await initCmd.handler(args as any);
}

async function listAllFiles(dir: string): Promise<Record<string, string>> {
  const paths = await glob("**/*", { cwd: dir });
  const files: Record<string, string> = {};

  for (const path of paths) {
    files[posix.normalize(path)] = await fs.promises.readFile(
      join(dir, path),
      "utf8"
    );
  }

  return files;
}

beforeEach(() => jest.resetAllMocks());

beforeEach(async () => {
  tmpDir = await tmp.dir({ tmpdir: tempDir, unsafeCleanup: true });
});

afterEach(() => tmpDir.cleanup());

describe("when the target exists and is not a directory", () => {
  let tmpFile: tmp.FileResult;

  beforeEach(async () => {
    tmpFile = await tmp.file({ tmpdir: tempDir });
  });

  afterEach(() => tmpFile.cleanup());

  test("should throw an error", async () => {
    await expect(execute({ path: tmpFile.path })).rejects.toThrow(
      "Path is not a directory"
    );
  });
});

describe("when the target exists and is not empty", () => {
  beforeEach(async () => {
    await fs.promises.writeFile(join(tmpDir.path, "test"), "foobar");
  });

  test("should throw an error without --force option", async () => {
    await expect(execute({ path: tmpDir.path })).rejects.toThrow(
      "Path already exists"
    );
  });

  test("should proceed with --force option", async () => {
    await expect(execute({ path: tmpDir.path, force: true })).toResolve();
  });

  test("should update package.json", async () => {
    const packageJsonPath = join(tmpDir.path, "package.json");

    await fs.promises.writeFile(
      packageJsonPath,
      JSON.stringify(
        {
          name: "foo",
          version: "1.2.3",
          dependencies: {
            debug: "3.2.1"
          }
        },
        null,
        "  "
      )
    );
    await expect(execute({ path: tmpDir.path, force: true })).toResolve();
    await expect(
      fs.promises.readFile(packageJsonPath, "utf8")
    ).resolves.toMatchSnapshot();
  });
});

describe("when the target exists and existing files can be ignored", () => {
  beforeEach(async () => {
    await fs.promises.writeFile(join(tmpDir.path, ".DS_Store"), "");
  });

  test("should succeed", async () => {
    await expect(execute({ path: tmpDir.path })).toResolve();
  });

  test("should throw an error if other unignorable files exist", async () => {
    await fs.promises.writeFile(join(tmpDir.path, "test"), "foobar");
    await expect(execute({ path: tmpDir.path })).rejects.toThrow(
      "Path already exists"
    );
  });
});

describe("when the target exists and only git folder exist", () => {
  beforeEach(async () => {
    await fs.promises.mkdir(join(tmpDir.path, ".git"));
  });

  test("should succeed", async () => {
    await expect(execute({ path: tmpDir.path })).toResolve();
  });
});

describe("when the target exists and only contain log files", () => {
  beforeEach(async () => {
    await fs.promises.writeFile(join(tmpDir.path, "npm.log"), "foo");
  });

  test("should succeed", async () => {
    await expect(execute({ path: tmpDir.path })).toResolve();
  });
});

describe("when path is not specified", () => {
  test("should use cwd instead", async () => {
    await expect(execute({ cwd: tmpDir.path })).toResolve();
  });
});

describe("when relative path is given", () => {
  test("should init in a new folder", async () => {
    await execute({ cwd: tmpDir.path, path: "foo" });

    const stats = await fs.promises.stat(join(tmpDir.path, "foo"));
    expect(stats.isDirectory()).toBeTrue();
  });
});

describe("when no options are given", () => {
  beforeEach(async () => {
    await execute({ path: tmpDir.path });
  });

  test("should generate files", async () => {
    await expect(listAllFiles(tmpDir.path)).resolves.toMatchSnapshot();
  });

  test("should not run install", async () => {
    expect(spawn).not.toHaveBeenCalled();
  });
});

describe("when --install option is given", () => {
  test("should run install in the folder", async () => {
    await execute({ path: tmpDir.path, install: true });
    expect(spawn).toHaveBeenCalledTimes(1);
    expect(spawn).toHaveBeenCalledWith("npm", ["install"], {
      cwd: tmpDir.path,
      stdio: "inherit",
      env: {
        ...process.env,
        ADBLOCK: "1",
        DISABLE_OPENCOLLECTIVE: "1"
      }
    });
  });
});

describe("when --esm option is given", () => {
  test("should generate files", async () => {
    await execute({ path: tmpDir.path, esm: true });
    await expect(listAllFiles(tmpDir.path)).resolves.toMatchSnapshot();
  });
});

describe("when --typescript option is given", () => {
  test("should generate files", async () => {
    await execute({ path: tmpDir.path, typescript: true });
    await expect(listAllFiles(tmpDir.path)).resolves.toMatchSnapshot();
  });
});

describe("when --typescript and --esm option is given", () => {
  test("should generate files", async () => {
    await execute({ path: tmpDir.path, typescript: true, esm: true });
    await expect(listAllFiles(tmpDir.path)).resolves.toMatchSnapshot();
  });
});
