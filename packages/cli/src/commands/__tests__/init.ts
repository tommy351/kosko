import fs from "fs";
import { join } from "path";
import { Signale } from "signale";
import tempDir from "temp-dir";
import tmp from "tmp-promise";
import { promisify } from "util";
import { setLogger } from "../../cli/command";
import { initCmd, writeJSON } from "../init";

const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

const logger = new Signale({ disabled: true });

beforeEach(() => jest.resetAllMocks());

describe("when the target exists", () => {
  let tmpDir: tmp.DirectoryResult;

  beforeEach(async () => {
    tmpDir = await tmp.dir({ dir: tempDir, unsafeCleanup: true });
  });

  afterEach(() => tmpDir.cleanup());

  test("should throw an error", async () => {
    const args = setLogger({ path: tmpDir.path } as any, logger);
    await expect(initCmd.handler(args)).rejects.toThrow("Already exists");
  });

  test("should proceed with --force flag", async () => {
    const args = setLogger({ path: tmpDir.path, force: true } as any, logger);
    await initCmd.handler(args);
  });

  describe("when package.json exists", () => {
    let pkgPath: string;

    beforeEach(async () => {
      pkgPath = join(tmpDir.path, "package.json");

      await writeJSON(pkgPath, {
        name: "foo",
        version: "1.2.3",
        dependencies: {
          debug: "3.2.1"
        }
      });
    });

    test("should update package.json", async () => {
      const args = setLogger({ path: tmpDir.path, force: true } as any, logger);
      await initCmd.handler(args);
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
    const args = setLogger({ cwd: tmpDir.path, force: true } as any, logger);
    await initCmd.handler(args);
  });
});

describe("success", () => {
  let tmpDir: tmp.DirectoryResult;
  let path: string;

  beforeAll(async () => {
    tmpDir = await tmp.dir({ unsafeCleanup: true });
    path = join(tmpDir.path, "target");

    const args = setLogger({ path } as any, logger);
    await initCmd.handler(args);
  });

  afterAll(() => tmpDir.cleanup());

  async function assertDir(...names: string[]) {
    const stats = await stat(join(path, ...names));
    expect(stats.isDirectory()).toBeTruthy();
  }

  async function assertFile(...names: string[]) {
    const content = await readFile(join(path, ...names), "utf8");
    expect(content).toMatchSnapshot();
  }

  test("should create components folder", () => assertDir("components"));

  test("should create environments folder", () => assertDir("environments"));

  test("should create templates folder", () => assertDir("templates"));

  test("should create package.json", () => assertFile("package.json"));

  test("should create kosko.toml", () => assertFile("kosko.toml"));
});
