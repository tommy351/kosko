import BufferList from "bl";
import fs from "fs";
import { join } from "path";
import tmpPromise from "tmp-promise";
import { promisify } from "util";
import { help } from "../../cli/help";
import { Logger } from "../../cli/logger";
import { Context } from "../../cli/types";
import { initCmd } from "../init";

const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);

jest.mock("../../cli/help");

const bl = new BufferList();
const ctx: Context = { logger: new Logger(bl) };

beforeEach(() => jest.resetAllMocks());

describe("when options.help is true", () => {
  test("should show help", async () => {
    await initCmd.exec(ctx, ["--help"]);
    expect(help).toHaveBeenCalledWith(initCmd);
    expect(help).toHaveBeenCalledTimes(1);
  });
});

describe("when argv parse failed", () => {
  // because it can't be failed
});

describe("when the target exists", () => {
  let tmpDir: tmpPromise.DirectoryResult;

  beforeEach(async () => {
    tmpDir = await tmpPromise.dir({ unsafeCleanup: true });
  });

  afterEach(() => tmpDir.cleanup());

  test("should throw an error", async () => {
    await expect(initCmd.exec(ctx, [tmpDir.path])).rejects.toThrow(
      "Already exists. Use --force to overwrite existing files."
    );
  });

  test("should proceed with --force flag", async () => {
    await initCmd.exec(ctx, [tmpDir.path, "--force"]);
  });
});

describe("when path is not specified", () => {
  let tmpDir: tmpPromise.DirectoryResult;

  beforeEach(async () => {
    tmpDir = await tmpPromise.dir({ unsafeCleanup: true });
  });

  afterEach(() => tmpDir.cleanup());

  test("should use cwd instead", async () => {
    await initCmd.exec(ctx, ["--cwd", tmpDir.path, "--force"]);
  });
});

describe("success", () => {
  let tmpDir: tmpPromise.DirectoryResult;
  let path: string;

  beforeAll(async () => {
    tmpDir = await tmpPromise.dir({ unsafeCleanup: true });
    path = join(tmpDir.path, "target");
    await initCmd.exec(ctx, [path]);
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

  test("should create index.js in environments folder", () =>
    assertFile("environments", "index.js"));

  test("should create package.json", () => assertFile("package.json"));
});
