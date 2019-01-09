import env from "@kosko/env";
import { generate, print, PrintFormat } from "@kosko/generate";
import fs from "fs";
import { join } from "path";
import pkgDir from "pkg-dir";
import { Signale } from "signale";
import symlinkDir from "symlink-dir";
import tmp from "tmp-promise";
import { promisify } from "util";
import { setLogger } from "../../cli/command";
import { generateCmd, GenerateArguments } from "../generate";

const writeFile = promisify(fs.writeFile);

jest.mock("@kosko/generate");
jest.mock("@kosko/env");

const logger = new Signale({ disabled: true });
let args: Partial<GenerateArguments>;
let tmpDir: tmp.DirectoryResult;

beforeEach(async () => {
  jest.resetAllMocks();

  const root = await pkgDir();
  tmpDir = await tmp.dir({ unsafeCleanup: true });
  await writeFile(join(tmpDir.path, "package.json"), "{}");
  await symlinkDir(
    join(root!, "packages", "env"),
    join(tmpDir.path, "node_modules", "@kosko", "env")
  );

  const ctx = setLogger({ cwd: tmpDir.path, ...args } as any, logger);
  await generateCmd.handler(ctx);
});

afterEach(() => tmpDir.cleanup());

describe("given components and output", () => {
  beforeAll(() => {
    args = { components: ["*"], output: PrintFormat.YAML };
  });

  test("should call generate once", () => {
    expect(generate).toHaveBeenCalledTimes(1);
  });

  test("should call generate with args", () => {
    expect(generate).toHaveBeenCalledWith({
      path: join(tmpDir.path, "components"),
      components: ["*"]
    });
  });

  test("should call print once", () => {
    expect(print).toHaveBeenCalledTimes(1);
  });

  test("should call print with args", () => {
    expect(print).toHaveBeenCalledWith(undefined, {
      format: PrintFormat.YAML,
      writer: process.stdout
    });
  });

  describe("without env", () => {
    test("should not set env", () => {
      expect(env.env).toBeUndefined();
    });
  });

  describe("with env", () => {
    beforeAll(() => {
      args.env = "foo";
    });

    test("should set env", () => {
      expect(env.env).toEqual("foo");
    });
  });
});
