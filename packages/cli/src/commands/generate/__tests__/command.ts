import toml from "@iarna/toml";
import { Config } from "@kosko/config";
import { Environment } from "@kosko/env";
import { generate, print, PrintFormat } from "@kosko/generate";
import assert from "node:assert";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import pkgDir from "pkg-dir";
import { generateCmd } from "../command";
import { GenerateArguments } from "../types";
import { TempDir, makeTempDir, installPackage } from "@kosko/test-utils";
import { getErrorCode } from "@kosko/common-utils";

jest.mock("@kosko/generate");
jest.mock("@kosko/log");

const mockedGenerate = jest.mocked(generate);

let tmpDir: TempDir;
let env: Environment;

async function createFakeModule(id: string): Promise<void> {
  const dir = join(tmpDir.path, "node_modules", id);
  await mkdir(dir, { recursive: true });
  await writeFile(
    join(dir, "index.js"),
    `require('fs').appendFileSync(__dirname + '/../../fakeModules', '${id},');`
  );
}

async function getLoadedFakeModules(): Promise<string[]> {
  try {
    const content = await readFile(join(tmpDir.path, "fakeModules"), "utf8");
    return content.split(",").filter(Boolean);
  } catch (err) {
    if (getErrorCode(err) === "ENOENT") return [];
    throw err;
  }
}

async function execute(args: Partial<GenerateArguments> = {}): Promise<void> {
  if (args.require?.length) {
    await Promise.all(args.require.map((id) => createFakeModule(id)));
  }

  await generateCmd.handler({ cwd: tmpDir.path, ...args } as any);
}

function mockGenerateSuccess() {
  mockedGenerate.mockResolvedValueOnce({
    manifests: [{ path: "", index: [0], data: {} }]
  });
}

async function writeConfig(path: string, config: Config) {
  const requires = [
    ...(config.require || []),
    ...Object.values(config.environments || {}).flatMap(
      (env) => env.require || []
    )
  ];

  await writeFile(path, toml.stringify(config as toml.JsonMap));
  await Promise.all(requires.map((id) => createFakeModule(id)));
}

function writeConfigToDefaultPath(config: Config = {}) {
  return writeConfig(join(tmpDir.path, "kosko.toml"), config);
}

beforeEach(async () => {
  const root = await pkgDir();
  assert(root);

  tmpDir = await makeTempDir();

  // Install @kosko/env in the temp folder
  const envPath = await installPackage(tmpDir.path, "env");
  env = require(envPath);
  env.setReducers = jest.fn();
});

afterEach(async () => {
  await tmpDir.cleanup();
});

describe("when components is neither specified in config nor args", () => {
  beforeEach(async () => {
    await writeConfigToDefaultPath();
  });

  test("should throw an error", async () => {
    await expect(execute()).rejects.toThrow("No components are given");
  });
});

describe("when components is specified in config", () => {
  beforeEach(async () => {
    mockGenerateSuccess();
    await writeConfigToDefaultPath({ components: ["a", "b"] });
    await execute();
  });

  test("should call generate once", () => {
    expect(generate).toHaveBeenCalledTimes(1);
  });

  test("should call generate with given components", () => {
    expect(generate).toHaveBeenCalledWith({
      path: join(tmpDir.path, "components"),
      components: ["a", "b"]
    });
  });

  test("should not set env", () => {
    expect(env.env).toBeUndefined();
  });

  test("should set cwd", () => {
    expect(env.cwd).toEqual(tmpDir.path);
  });

  test("should not require any modules", async () => {
    expect(await getLoadedFakeModules()).toEqual([]);
  });
});

describe("when components is specified in args", () => {
  beforeEach(async () => {
    mockGenerateSuccess();
    await writeConfigToDefaultPath();
    await execute({ components: ["a", "b"] });
  });

  test("should call generate with given components", () => {
    expect(generate).toHaveBeenCalledWith({
      path: join(tmpDir.path, "components"),
      components: ["a", "b"]
    });
  });
});

describe("when components is specified in both config and args", () => {
  beforeEach(async () => {
    mockGenerateSuccess();
    await writeConfigToDefaultPath({ components: ["a", "b"] });
    await execute({ components: ["c", "d"] });
  });

  test("should call generate with components specified in args", () => {
    expect(generate).toHaveBeenCalledWith({
      path: join(tmpDir.path, "components"),
      components: ["c", "d"]
    });
  });
});

describe("with output is specified", () => {
  beforeEach(async () => {
    mockGenerateSuccess();
    await writeConfigToDefaultPath({ components: ["*"] });
    await execute({ output: PrintFormat.YAML });
  });

  test("should call print once", () => {
    expect(print).toHaveBeenCalledTimes(1);
  });

  test("should call print with given format", () => {
    expect(print).toHaveBeenCalledWith(
      {
        manifests: [{ path: "", index: [0], data: {} }]
      },
      {
        format: PrintFormat.YAML,
        writer: process.stdout
      }
    );
  });
});

describe("when env is specified", () => {
  beforeEach(async () => {
    mockGenerateSuccess();
    await writeConfigToDefaultPath({
      components: ["a", "b"],
      environments: {
        dev: {
          components: ["c", "d"]
        }
      }
    });
    await execute({ env: "dev" });
  });

  test("should set env", () => {
    expect(env.env).toEqual("dev");
  });

  test("should add environment specific components", () => {
    expect(generate).toHaveBeenCalledWith({
      path: join(tmpDir.path, "components"),
      components: ["a", "b", "c", "d"]
    });
  });
});

describe("when baseEnvironment is specified and env is not", () => {
  beforeEach(async () => {
    mockGenerateSuccess();
    await writeConfigToDefaultPath({
      components: ["a", "b"],
      baseEnvironment: "base",
      environments: {
        dev: {
          components: ["c", "d"]
        },
        base: {
          components: ["e", "f"]
        }
      }
    });
    await execute();
  });

  test("should set env as baseEnvironment", () => {
    expect(env.env).toEqual("base");
  });

  test("should add components from baseEnvironment", () => {
    expect(generate).toHaveBeenCalledWith({
      path: join(tmpDir.path, "components"),
      components: ["a", "b", "e", "f"]
    });
  });
});

describe("when both baseEnvironment and env are specified", () => {
  beforeEach(async () => {
    mockGenerateSuccess();
    await writeConfigToDefaultPath({
      components: ["a", "b"],
      baseEnvironment: "base",
      environments: {
        dev: {
          components: ["c", "d"]
        },
        base: {
          components: ["e", "f"]
        }
      }
    });
    await execute({ env: "dev" });
  });

  test("should set env as an array", () => {
    expect(env.env).toEqual(["base", "dev"]);
  });

  test("should add components from baseEnvironment", () => {
    expect(generate).toHaveBeenCalledWith({
      path: join(tmpDir.path, "components"),
      components: ["a", "b", "e", "f", "c", "d"]
    });
  });
});

describe("when extensions is specified in config", () => {
  beforeEach(async () => {
    mockGenerateSuccess();
    await writeConfigToDefaultPath({
      components: ["*"],
      extensions: ["a", "b"]
    });
    await execute();
  });

  test("should call generate with extensions", () => {
    expect(generate).toHaveBeenCalledWith({
      path: join(tmpDir.path, "components"),
      components: ["*"],
      extensions: ["a", "b"]
    });
  });
});

describe("when require is specified in config", () => {
  beforeEach(async () => {
    mockGenerateSuccess();
    await writeConfigToDefaultPath({
      components: ["*"],
      require: ["fake1", "fake2"],
      environments: {
        dev: {
          require: ["fake3", "fake4"]
        }
      }
    });
    await execute();
  });

  test("should require modules", async () => {
    expect(await getLoadedFakeModules()).toEqual(["fake1", "fake2"]);
  });
});

describe("when require is specified in args", () => {
  beforeEach(async () => {
    mockGenerateSuccess();
    await writeConfigToDefaultPath({
      components: ["*"]
    });
    await execute({ require: ["fake1", "fake2"] });
  });

  test("should require modules", async () => {
    expect(await getLoadedFakeModules()).toEqual(["fake1", "fake2"]);
  });
});

describe("when require is specified in both config and args", () => {
  beforeEach(async () => {
    mockGenerateSuccess();
    await writeConfigToDefaultPath({
      components: ["*"],
      require: ["fake1", "fake2"]
    });
    await execute({ require: ["fake3", "fake4"] });
  });

  test("should require modules specified in both config and args", async () => {
    expect(await getLoadedFakeModules()).toEqual([
      "fake1",
      "fake2",
      "fake3",
      "fake4"
    ]);
  });
});

describe("when require is specified in env", () => {
  beforeEach(async () => {
    mockGenerateSuccess();
    await writeConfigToDefaultPath({
      components: ["*"],
      require: ["fake1", "fake2"],
      environments: {
        dev: {
          require: ["fake3", "fake4"]
        }
      }
    });
    await execute({ env: "dev" });
  });

  test("should require modules specified in both config and env", async () => {
    expect(await getLoadedFakeModules()).toEqual([
      "fake1",
      "fake2",
      "fake3",
      "fake4"
    ]);
  });
});

describe("when set is specified in args", () => {
  beforeEach(async () => {
    mockGenerateSuccess();
    await writeConfigToDefaultPath({ components: ["*"] });
    await execute({ set: [{ key: "a", value: "b" }] });
  });

  test("should add reducer to env", () => {
    expect(env.setReducers).toHaveBeenCalledWith(expect.any(Function));
  });
});

describe("when no manifests are exported", () => {
  beforeEach(async () => {
    mockedGenerate.mockResolvedValueOnce({ manifests: [] });
    await writeConfigToDefaultPath({ components: ["*"] });
  });

  test("should throw an error", async () => {
    await expect(execute()).rejects.toThrow("No manifests are exported");
  });
});

describe("when config is a relative path", () => {
  beforeEach(async () => {
    mockGenerateSuccess();
    await writeConfig(join(tmpDir.path, "kosko-relative.toml"), {
      components: ["foo"]
    });
    await execute({ config: "kosko-relative.toml" });
  });

  test("should call generate with components set in config", () => {
    expect(generate).toHaveBeenCalledWith({
      path: join(tmpDir.path, "components"),
      components: ["foo"]
    });
  });
});

describe("when config is an absolute path", () => {
  beforeEach(async () => {
    const configPath = join(tmpDir.path, "kosko-absolute.toml");

    mockGenerateSuccess();
    await writeConfig(configPath, {
      components: ["foo"]
    });
    await execute({ config: configPath });
  });

  test("should call generate with components set in config", () => {
    expect(generate).toHaveBeenCalledWith({
      path: join(tmpDir.path, "components"),
      components: ["foo"]
    });
  });
});

describe("when config does not exist", () => {
  test("should throw an error", async () => {
    await expect(execute({ config: "abc.toml" })).rejects.toThrow("ENOENT");
  });
});

describe.each([
  { arg: undefined, config: undefined, expected: undefined },
  { arg: true, config: undefined, expected: true },
  { arg: undefined, config: true, expected: true },
  { arg: false, config: true, expected: false },
  { arg: true, config: false, expected: true }
])(
  "when arg.bail = $arg, config.bail = $config",
  ({ arg, config, expected }) => {
    beforeEach(async () => {
      mockGenerateSuccess();
      await writeConfigToDefaultPath({
        components: ["*"],
        bail: config
      });
      await execute({ bail: arg });
    });

    test(`should call generate with bail = ${expected}`, () => {
      expect(generate).toHaveBeenCalledWith({
        path: join(tmpDir.path, "components"),
        components: ["*"],
        bail: expected
      });
    });
  }
);
