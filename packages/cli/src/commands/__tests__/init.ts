/// <reference types="jest-extended"/>
import { readFile, stat, writeJSON } from "fs-extra";
import { join } from "path";
import { Signale } from "signale";
import tempDir from "temp-dir";
import tmp from "tmp-promise";
import { setLogger } from "../../cli/command";
import { initCmd, InitArguments } from "../init";

const logger = new Signale({ disabled: true });

async function execute(args: Partial<InitArguments>): Promise<void> {
  const ctx = setLogger(args as any, logger);
  await initCmd.handler(ctx);
}

beforeEach(() => jest.resetAllMocks());

describe("when the target exists", () => {
  let tmpDir: tmp.DirectoryResult;

  beforeEach(async () => {
    tmpDir = await tmp.dir({ tmpdir: tempDir, unsafeCleanup: true });
  });

  afterEach(async () => {
    await tmpDir.cleanup();
  });

  test("should throw an error", async () => {
    await expect(execute({ path: tmpDir.path })).rejects.toThrow(
      "Already exists"
    );
  });

  test("should proceed with --force flag", async () => {
    const args = setLogger({ path: tmpDir.path, force: true } as any, logger);
    await expect(initCmd.handler(args)).toResolve();
  });

  describe("when package.json exists", () => {
    let pkgPath: string;

    beforeEach(async () => {
      pkgPath = join(tmpDir.path, "package.json");

      await writeJSON(
        pkgPath,
        {
          name: "foo",
          version: "1.2.3",
          dependencies: {
            debug: "3.2.1"
          }
        },
        { spaces: 2 }
      );

      await execute({ path: tmpDir.path, force: true });
    });

    test("should update package.json", async () => {
      const content = await readFile(pkgPath, "utf8");
      expect(content).toMatchSnapshot();
    });
  });
});

describe("when path is not specified", () => {
  let tmpDir: tmp.DirectoryResult;

  beforeEach(async () => {
    tmpDir = await tmp.dir({ unsafeCleanup: true });
  });

  afterEach(() => tmpDir.cleanup());

  test("should use cwd instead", async () => {
    await expect(execute({ cwd: tmpDir.path, force: true })).toResolve();
  });
});

describe("success", () => {
  let tmpDir: tmp.DirectoryResult;
  let path: string;

  beforeAll(async () => {
    tmpDir = await tmp.dir({ unsafeCleanup: true });
    path = join(tmpDir.path, "target");

    await execute({ path });
  });

  afterAll(() => tmpDir.cleanup());

  async function isDirectory(...names: string[]): Promise<boolean> {
    const stats = await stat(join(path, ...names));
    return stats.isDirectory();
  }

  async function readFileContent(...names: string[]): Promise<string> {
    return readFile(join(path, ...names), "utf8");
  }

  test("should create components folder", async () => {
    await expect(isDirectory("components")).resolves.toBeTrue();
  });

  test("should create environments folder", async () => {
    await expect(isDirectory("environments")).resolves.toBeTrue();
  });

  test("should create templates folder", async () => {
    await expect(isDirectory("templates")).resolves.toBeTrue();
  });

  test("should create package.json", async () => {
    await expect(readFileContent("package.json")).resolves.toMatchSnapshot();
  });

  test("should create kosko.toml", async () => {
    await expect(readFileContent("kosko.toml")).resolves.toMatchSnapshot();
  });
});
