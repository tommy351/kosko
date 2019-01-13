import toml from "@iarna/toml";
import { Config } from "@kosko/config";
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
const readDir = promisify(fs.readdir);

jest.mock("@kosko/generate");
jest.mock("@kosko/env");

const logger = new Signale({ disabled: true });
let config: Config;
let args: Partial<GenerateArguments>;
let tmpDir: tmp.DirectoryResult;

function newContext() {
  return setLogger({ cwd: tmpDir.path, ...args } as any, logger);
}

async function createFakeModule(id: string) {
  const dir = join(tmpDir.path, "node_modules", id);
  await makeDir(dir);
  await writeFile(
    join(dir, "index.js"),
    `require('fs').writeFileSync(__dirname + '/../../${id}', '');`
  );
}

beforeEach(async () => {
  // Reset mocks
  jest.resetAllMocks();

  // Reset env
  env.env = undefined;

  const root = await pkgDir();
  tmpDir = await tmp.dir({ unsafeCleanup: true });

  // Write kosko.tmol
  await writeFile(
    join(tmpDir.path, "kosko.toml"),
    toml.stringify(config as any)
  );

  // Install @kosko/env in the temp folder
  await symlinkDir(
    join(root!, "packages", "env"),
    join(tmpDir.path, "node_modules", "@kosko", "env")
  );
});

afterEach(() => tmpDir.cleanup());

describe("given output", () => {
  beforeAll(() => {
    args = { output: PrintFormat.YAML };
    config = {};
  });

  beforeEach(async () => {
    await generateCmd.handler(newContext());
  });

  test("should call generate once", () => {
    expect(generate).toHaveBeenCalledTimes(1);
  });

  test("should call generate with default components", () => {
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

  test("should not set env", () => {
    expect(env.env).toBeUndefined();
  });

  describe("and env", () => {
    beforeAll(() => {
      args.env = "foo";
    });

    test("should set env", () => {
      expect(env.env).toEqual("foo");
    });

    test("should set cwd", () => {
      expect(env.cwd).toEqual(tmpDir.path);
    });
  });
});

describe("given components", () => {
  beforeAll(() => {
    args = { components: ["a", "b"] };
    config = {};
  });

  beforeEach(async () => {
    await generateCmd.handler(newContext());
  });

  test("should generate with components from args", () => {
    expect(generate).toHaveBeenCalledWith({
      path: join(tmpDir.path, "components"),
      components: ["a", "b"]
    });
  });

  describe("and config", () => {
    beforeAll(() => {
      config = {
        components: ["c", "d"],
        environments: {
          dev: {
            components: ["e", "f"]
          }
        }
      };
    });

    test("should add components in global config", () => {
      expect(generate).toHaveBeenCalledWith({
        path: join(tmpDir.path, "components"),
        components: ["c", "d", "a", "b"]
      });
    });

    describe("and env", () => {
      beforeAll(() => {
        args.env = "dev";
      });

      test("should add components in env config", () => {
        expect(generate).toHaveBeenCalledWith({
          path: join(tmpDir.path, "components"),
          components: ["c", "d", "e", "f", "a", "b"]
        });
      });
    });
  });
});

describe("given require", () => {
  beforeAll(async () => {
    args = {
      require: ["fake-mod1", "fake-mod2"]
    };
    config = {};
  });

  describe("when module exists", () => {
    let files: string[];

    beforeEach(async () => {
      for (const id of args.require || []) {
        await createFakeModule(id);
      }

      await generateCmd.handler(newContext());
      files = await readDir(tmpDir.path);
    });

    test("should require modules in args", () => {
      expect(files).toEqual(expect.arrayContaining(args.require!));
    });
  });

  describe("when module does not exist", () => {
    test("should require all modules", async () => {
      await expect(generateCmd.handler(newContext())).rejects.toThrow(
        /Cannot find module/
      );
    });
  });

  describe("and config", () => {
    let files: string[];

    beforeAll(() => {
      config = {
        require: ["fake-mod3", "fake-mod4"],
        environments: {
          dev: {
            require: ["fake-mod5", "fake-mod6"]
          }
        }
      };
    });

    beforeEach(async () => {
      const modules = [
        ...args.require!,
        ...config.require!,
        ...config.environments!.dev.require!
      ];

      for (const id of modules) {
        await createFakeModule(id);
      }

      await generateCmd.handler(newContext());
      files = await readDir(tmpDir.path);
    });

    test("should require modules in args", () => {
      expect(files).toEqual(expect.arrayContaining(args.require!));
    });

    test("should require modules in global config", () => {
      expect(files).toEqual(
        expect.arrayContaining(config.require! as string[])
      );
    });

    test("should not require modules in env config", () => {
      expect(files).not.toEqual(
        expect.arrayContaining(config.environments!.dev.require! as string[])
      );
    });

    describe("and env", () => {
      beforeAll(() => {
        args.env = "dev";
      });

      test("should require modules in args", () => {
        expect(files).toEqual(expect.arrayContaining(args.require!));
      });

      test("should require modules in global config", () => {
        expect(files).toEqual(
          expect.arrayContaining(config.require! as string[])
        );
      });

      test("should require modules in env config", () => {
        expect(files).toEqual(
          expect.arrayContaining(config.environments!.dev.require! as string[])
        );
      });
    });
  });
});
