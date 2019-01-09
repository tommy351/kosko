import env from "@kosko/env";
import { generate, print, PrintFormat } from "@kosko/generate";
import fs from "fs";
import makeDir from "make-dir";
import { join } from "path";
import pkgDir from "pkg-dir";
import { Signale } from "signale";
import symlinkDir from "symlink-dir";
import tmp from "tmp-promise";
import { promisify } from "util";
import { setLogger } from "../../cli/command";
import { GenerateArguments, generateCmd } from "../generate";

const writeFile = promisify(fs.writeFile);
const access = promisify(fs.access);

jest.mock("@kosko/generate");
jest.mock("@kosko/env");

const logger = new Signale({ disabled: true });
let args: Partial<GenerateArguments>;
let tmpDir: tmp.DirectoryResult;

function newContext() {
  return setLogger({ cwd: tmpDir.path, ...args } as any, logger);
}

beforeEach(async () => {
  jest.resetAllMocks();

  const root = await pkgDir();
  tmpDir = await tmp.dir({ unsafeCleanup: true });
  await writeFile(join(tmpDir.path, "package.json"), "{}");
  await symlinkDir(
    join(root!, "packages", "env"),
    join(tmpDir.path, "node_modules", "@kosko", "env")
  );
});

afterEach(() => tmpDir.cleanup());

describe("given components and output", () => {
  beforeAll(() => {
    args = { components: ["*"], output: PrintFormat.YAML };
  });

  beforeEach(async () => {
    await generateCmd.handler(newContext());
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

describe("given require", () => {
  beforeAll(async () => {
    args.require = ["fake-mod1", "fake-mod2"];
  });

  async function createFakeModule(id: string) {
    const dir = join(tmpDir.path, "node_modules", id);
    await makeDir(dir);
    await writeFile(
      join(dir, "index.js"),
      `require('fs').writeFileSync('${join(tmpDir.path, id)}', '');`
    );
  }

  describe("when module exists", () => {
    beforeEach(async () => {
      for (const id of args.require || []) {
        await createFakeModule(id);
      }

      await generateCmd.handler(newContext());
    });

    test("should require all modules", async () => {
      for (const id of args.require!) {
        await access(join(tmpDir.path, id));
      }
    });
  });

  describe("when module does not exist", () => {
    test("should require all modules", async () => {
      await expect(generateCmd.handler(newContext())).rejects.toThrow(
        /Cannot find module/
      );
    });
  });
});
