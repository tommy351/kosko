import toml from "@iarna/toml";
import { Config } from "@kosko/config";
import env from "@kosko/env";
import { generate, print, PrintFormat, Result } from "@kosko/generate";
import { writeFile, readFile, outputFile, ensureSymlink } from "fs-extra";
import { join } from "path";
import pkgDir from "pkg-dir";
import { Signale } from "signale";
import tempDir from "temp-dir";
import tmp from "tmp-promise";
import { setLogger } from "../../../cli/command";
import { GenerateArguments, generateCmd } from "../index";

jest.mock("@kosko/generate");
jest.mock("@kosko/env");

type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };

const logger = new Signale({ disabled: true });
let config: DeepWriteable<Config>;
let args: Partial<GenerateArguments>;
let tmpDir: tmp.DirectoryResult;
let result: Result;

async function createFakeModule(id: string): Promise<void> {
  const dir = join(tmpDir.path, "node_modules", id);
  await outputFile(
    join(dir, "index.js"),
    `require('fs').appendFileSync(__dirname + '/../../fakeModules', '${id},');`
  );
}

async function getLoadedFakeModules(): Promise<ReadonlyArray<string>> {
  const content = await readFile(join(tmpDir.path, "fakeModules"), "utf8");
  return content.split(",").filter(Boolean);
}

async function execute(): Promise<void> {
  // Mock result
  (generate as jest.Mock).mockResolvedValueOnce(result);

  const ctx = setLogger({ cwd: tmpDir.path, ...args } as any, logger);
  await generateCmd.handler(ctx);
}

beforeEach(async () => {
  // Reset mocks
  jest.resetAllMocks();

  const root = await pkgDir();
  tmpDir = await tmp.dir({ tmpdir: tempDir, unsafeCleanup: true });

  // Write kosko.toml
  await writeFile(
    join(tmpDir.path, "kosko.toml"),
    toml.stringify(config as toml.JsonMap)
  );

  // Install @kosko/env in the temp folder
  const envSrc = join(root!, "packages", "env");
  const envDest = join(tmpDir.path, "node_modules", "@kosko", "env");

  await ensureSymlink(envSrc, envDest, "dir");
});

afterEach(async () => {
  await tmpDir.cleanup();
});

describe("without components", () => {
  beforeAll(() => {
    args = {};
    config = {};
  });

  test("should throw an error", async () => {
    await expect(execute()).rejects.toThrow("No components are given");
  });
});

describe("with components in config", () => {
  beforeAll(() => {
    args = {};
    config = {
      components: ["a", "b"],
      require: ["fake1", "fake2"],
      extensions: ["x", "y", "z"],
      environments: {
        dev: {
          components: ["c", "d"],
          require: ["fake3", "fake4"]
        }
      },
      paths: {
        environment: {
          global: "foo",
          component: "bar"
        }
      }
    };
    result = {
      manifests: [{ path: "", index: [0], data: {} }]
    };
  });

  beforeEach(async () => {
    const modules = [
      ...(args.require || []),
      ...config.require!,
      ...config.environments!.dev.require!
    ];

    for (const id of modules) {
      await createFakeModule(id);
    }

    await execute();
  });

  test("should call generate once", () => {
    expect(generate).toHaveBeenCalledTimes(1);
  });

  test("should call generate with given components", () => {
    expect(generate).toHaveBeenCalledWith({
      path: join(tmpDir.path, "components"),
      components: ["a", "b"],
      extensions: ["x", "y", "z"]
    });
  });

  test("should not set env", () => {
    expect(env.env).toBeUndefined();
  });

  test("should require modules in config", async () => {
    expect(await getLoadedFakeModules()).toEqual(config.require);
  });

  describe("given output", () => {
    beforeAll(() => {
      args.output = PrintFormat.YAML;
    });

    test("should call print once", () => {
      expect(print).toHaveBeenCalledTimes(1);
    });

    test("should call print with given format", () => {
      expect(print).toHaveBeenCalledWith(result, {
        format: PrintFormat.YAML,
        writer: process.stdout
      });
    });
  });

  describe("given env", () => {
    beforeAll(() => {
      args.env = "dev";
    });

    test("should add environment specific components", () => {
      expect(generate).toHaveBeenCalledWith({
        path: join(tmpDir.path, "components"),
        components: ["a", "b", "c", "d"],
        extensions: ["x", "y", "z"]
      });
    });

    test("should set env", () => {
      expect(env.env).toEqual("dev");
    });

    test("should set cwd", () => {
      expect(env.cwd).toEqual(tmpDir.path);
    });

    test("should set global path", () => {
      expect(env.paths.global).toEqual(config.paths!.environment!.global);
    });

    test("should set component path", () => {
      expect(env.paths.component).toEqual(config.paths!.environment!.component);
    });

    test("should also require modules in env config", async () => {
      expect(await getLoadedFakeModules()).toEqual([
        ...config.require!,
        ...config.environments!.dev.require!
      ]);
    });
  });

  describe("given require in arguments", () => {
    beforeAll(() => {
      args.require = ["fake5", "fake6"];
      args.env = undefined;
    });

    test("should also require modules in arguments", async () => {
      expect(await getLoadedFakeModules()).toEqual([
        ...config.require!,
        ...args.require!
      ]);
    });

    describe("with env", () => {
      beforeAll(() => {
        args.env = "dev";
      });

      test("should also require modules in arguments", async () => {
        expect(await getLoadedFakeModules()).toEqual([
          ...config.require!,
          ...config.environments!.dev.require!,
          ...args.require!
        ]);
      });
    });
  });

  describe("override components in arguments", () => {
    beforeAll(() => {
      args.components = ["e", "f"];
    });

    test("should call generate with given components", () => {
      expect(generate).toHaveBeenCalledWith({
        path: join(tmpDir.path, "components"),
        components: ["e", "f"],
        extensions: ["x", "y", "z"]
      });
    });
  });

  describe("given set in arguments", () => {
    beforeAll(() => {
      args.set = [{ key: "a", value: "b" }];
    });

    test("should add reducer to the env", () => {
      expect(env.setReducers).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("given validate = true", () => {
    beforeAll(() => {
      args.validate = true;
    });

    test("should call generate with validate = true", () => {
      expect(generate).toHaveBeenCalledWith(
        expect.objectContaining({
          validate: true
        })
      );
    });
  });

  describe("given baseEnvironment", () => {
    beforeAll(() => {
      config.baseEnvironment = "base";
    });

    describe("and env is not set", () => {
      beforeAll(() => {
        args.env = undefined;
      });

      test("should set env to baseEnvironment", () => {
        expect(env.env).toEqual("base");
      });
    });

    describe("and env is set", () => {
      beforeAll(() => {
        args.env = "dev";
      });

      test("should set env to an array", () => {
        expect(env.env).toEqual(["base", "dev"]);
      });
    });
  });
});

describe("when no manifests are exported", () => {
  beforeAll(() => {
    args = {};
    config = { components: ["*"] };
    result = { manifests: [] };
  });

  test("should throw an error", async () => {
    await expect(execute()).rejects.toThrow("No manifests are exported");
  });
});
