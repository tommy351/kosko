import toml from "@iarna/toml";
import { Config } from "@kosko/config";
import { Environment } from "@kosko/env";
import assert from "node:assert";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import pkgDir from "pkg-dir";
import { generateCmd } from "../command";
import { GenerateArguments } from "../types";
import { TempDir, makeTempDir, installPackage } from "@kosko/test-utils";
import { getErrorCode } from "@kosko/common-utils";
import { PrintFormat } from "@kosko/generate";
import BufferList from "bl";
import yaml from "js-yaml";
import { getStdout, getStderr } from "../process";
import { CLIError } from "../../../cli/error";

jest.mock("@kosko/log");
jest.mock("../process");

const mockGetStdout = jest.mocked(getStdout);
const mockGetStderr = jest.mocked(getStderr);

let tmpDir: TempDir;
let env: Environment;
let stdout: BufferList;
let stderr: BufferList;

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

  await generateCmd.handler({
    cwd: tmpDir.path,
    output: PrintFormat.YAML,
    ...args
  } as any);
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

async function writeComponents(files: Record<string, string>) {
  const dir = join(tmpDir.path, "components");

  await mkdir(dir, { recursive: true });

  for (const [name, content] of Object.entries(files)) {
    const path = join(dir, name);

    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content);
  }
}

beforeEach(async () => {
  const root = await pkgDir();
  assert(root);

  tmpDir = await makeTempDir();

  // Install @kosko/env in the temp folder
  const envPath = await installPackage(tmpDir.path, "env");
  env = require(envPath);
  env.setReducers = jest.fn();

  stdout = new BufferList();
  mockGetStdout.mockReturnValue(stdout);

  stderr = new BufferList();
  mockGetStderr.mockReturnValue(stderr);
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
    await writeConfigToDefaultPath({ components: ["a", "b"] });
    await writeComponents({
      "a.js": "module.exports = {a: 1}",
      "b.js": "module.exports = {b: 2}",
      "c.js": "module.exports = {c: 3}"
    });
    await execute();
  });

  test("should print specified components", () => {
    expect(yaml.loadAll(stdout.toString())).toEqual([{ a: 1 }, { b: 2 }]);
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
    await writeConfigToDefaultPath();
    await writeComponents({
      "a.js": "module.exports = {a: 1}",
      "b.js": "module.exports = {b: 2}",
      "c.js": "module.exports = {c: 3}"
    });
    await execute({ components: ["a", "b"] });
  });

  test("should print specified components", async () => {
    expect(yaml.loadAll(stdout.toString())).toEqual([{ a: 1 }, { b: 2 }]);
  });
});

describe("when components is specified in both config and args", () => {
  beforeEach(async () => {
    await writeConfigToDefaultPath({ components: ["a", "b"] });
    await writeComponents({
      "a.js": "module.exports = {a: 1}",
      "b.js": "module.exports = {b: 2}",
      "c.js": "module.exports = {c: 3}",
      "d.js": "module.exports = {d: 4}"
    });
    await execute({ components: ["c", "d"] });
  });

  test("should print components specified in args", async () => {
    expect(yaml.loadAll(stdout.toString())).toEqual([{ c: 3 }, { d: 4 }]);
  });
});

describe("when output = json", () => {
  beforeEach(async () => {
    await writeConfigToDefaultPath({ components: ["*"] });
    await writeComponents({
      "a.js": "module.exports = {a: 1}"
    });
    await execute({ output: PrintFormat.JSON });
  });

  test("should print in JSON format", async () => {
    expect(JSON.parse(stdout.toString())).toEqual({ a: 1 });
  });
});

describe("when env is specified", () => {
  beforeEach(async () => {
    await writeConfigToDefaultPath({
      components: ["a", "b"],
      environments: {
        dev: {
          components: ["c", "d"]
        }
      }
    });
    await writeComponents({
      "a.js": "module.exports = {a: 1}",
      "b.js": "module.exports = {b: 2}",
      "c.js": "module.exports = {c: 3}",
      "d.js": "module.exports = {d: 4}",
      "e.js": "module.exports = {e: 5}"
    });
    await execute({ env: "dev" });
  });

  test("should set env", () => {
    expect(env.env).toEqual("dev");
  });

  test("should add environment-specific components", () => {
    expect(yaml.loadAll(stdout.toString())).toEqual([
      { a: 1 },
      { b: 2 },
      { c: 3 },
      { d: 4 }
    ]);
  });
});

describe("when baseEnvironment is specified and env is not", () => {
  beforeEach(async () => {
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
    await writeComponents({
      "a.js": "module.exports = {a: 1}",
      "b.js": "module.exports = {b: 2}",
      "c.js": "module.exports = {c: 3}",
      "d.js": "module.exports = {d: 4}",
      "e.js": "module.exports = {e: 5}",
      "f.js": "module.exports = {f: 6}",
      "g.js": "module.exports = {g: 7}"
    });
    await execute();
  });

  test("should set env as baseEnvironment", () => {
    expect(env.env).toEqual("base");
  });

  test("should add components from baseEnvironment", () => {
    expect(yaml.loadAll(stdout.toString())).toEqual([
      { a: 1 },
      { b: 2 },
      { e: 5 },
      { f: 6 }
    ]);
  });
});

describe("when both baseEnvironment and env are specified", () => {
  beforeEach(async () => {
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
    await writeComponents({
      "a.js": "module.exports = {a: 1}",
      "b.js": "module.exports = {b: 2}",
      "c.js": "module.exports = {c: 3}",
      "d.js": "module.exports = {d: 4}",
      "e.js": "module.exports = {e: 5}",
      "f.js": "module.exports = {f: 6}",
      "g.js": "module.exports = {g: 7}"
    });
    await execute({ env: "dev" });
  });

  test("should set env as an array", () => {
    expect(env.env).toEqual(["base", "dev"]);
  });

  test("should add components from baseEnvironment and env", () => {
    expect(yaml.loadAll(stdout.toString())).toEqual([
      { a: 1 },
      { b: 2 },
      { c: 3 },
      { d: 4 },
      { e: 5 },
      { f: 6 }
    ]);
  });
});

describe("when extensions is specified in config", () => {
  beforeEach(async () => {
    await writeConfigToDefaultPath({
      components: ["*"],
      extensions: ["custom.js"]
    });
    await writeComponents({
      "a.js": "module.exports = {a: 1}",
      "a.custom.js": 'module.exports = {a: "custom"}'
    });
    await execute();
  });

  test("should load the specified extensions", async () => {
    expect(yaml.loadAll(stdout.toString())).toEqual([{ a: "custom" }]);
  });
});

describe("when require is specified in config", () => {
  beforeEach(async () => {
    await writeConfigToDefaultPath({
      components: ["*"],
      require: ["fake1", "fake2"],
      environments: {
        dev: {
          require: ["fake3", "fake4"]
        }
      }
    });
    await writeComponents({
      "a.js": "module.exports = {a: 1}"
    });
    await execute();
  });

  test("should require modules", async () => {
    expect(await getLoadedFakeModules()).toEqual(["fake1", "fake2"]);
  });
});

describe("when require is specified in args", () => {
  beforeEach(async () => {
    await writeConfigToDefaultPath({
      components: ["*"]
    });
    await writeComponents({
      "a.js": "module.exports = {a: 1}"
    });
    await execute({ require: ["fake1", "fake2"] });
  });

  test("should require modules", async () => {
    expect(await getLoadedFakeModules()).toEqual(["fake1", "fake2"]);
  });
});

describe("when require is specified in both config and args", () => {
  beforeEach(async () => {
    await writeConfigToDefaultPath({
      components: ["*"],
      require: ["fake1", "fake2"]
    });
    await writeComponents({
      "a.js": "module.exports = {a: 1}"
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
    await writeConfigToDefaultPath({
      components: ["*"],
      require: ["fake1", "fake2"],
      environments: {
        dev: {
          require: ["fake3", "fake4"]
        }
      }
    });
    await writeComponents({
      "a.js": "module.exports = {a: 1}"
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
    await writeConfigToDefaultPath({ components: ["*"] });
    await writeComponents({
      "a.js": `module.exports = {}`
    });
    await execute({ set: [{ key: "a", value: "b" }] });
  });

  test("should add reducer to env", () => {
    expect(env.setReducers).toHaveBeenCalledWith(expect.any(Function));
  });
});

describe("when no manifests are exported", () => {
  beforeEach(async () => {
    await writeComponents({});
    await writeConfigToDefaultPath({ components: ["*"] });
  });

  test("should throw an error", async () => {
    await expect(execute()).rejects.toThrow("No manifests are exported");
  });
});

describe("when config is a relative path", () => {
  beforeEach(async () => {
    await writeConfig(join(tmpDir.path, "kosko-relative.toml"), {
      components: ["foo"]
    });
    await writeComponents({
      "foo.js": "module.exports = { foo: 1 }"
    });
    await execute({ config: "kosko-relative.toml" });
  });

  test("should call generate with components set in config", () => {
    expect(yaml.loadAll(stdout.toString())).toEqual([{ foo: 1 }]);
  });
});

describe("when config is an absolute path", () => {
  beforeEach(async () => {
    const configPath = join(tmpDir.path, "kosko-absolute.toml");

    await writeConfig(configPath, {
      components: ["foo"]
    });
    await writeComponents({
      "foo.js": "module.exports = { foo: 1 }"
    });
    await execute({ config: configPath });
  });

  test("should call generate with components set in config", () => {
    expect(yaml.loadAll(stdout.toString())).toEqual([{ foo: 1 }]);
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
      await writeConfigToDefaultPath({
        components: ["*"],
        bail: config
      });
      await writeComponents({
        "a.js": `throw new Error("a")`,
        "b.js": `throw new Error("b")`
      });
    });

    test(`should set bail = ${expected}`, async () => {
      const err = new CLIError("Generate failed", {
        output: `Generate failed (${
          expected
            ? "Only the first error is displayed because `bail` option is enabled"
            : `Total 2 errors`
        })`
      });

      await expect(
        execute({
          bail: arg
        })
      ).rejects.toThrow(err);
    });
  }
);
