/// <reference types="jest-extended"/>
import { type Arguments, command } from "../command";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "@kosko/exec-utils";
import stringify from "fast-safe-stringify";
import {
  makeTempDir,
  makeTempFile,
  TempDir,
  TempFile
} from "@kosko/test-utils";
import logger, { LogLevel } from "@kosko/log";
import { listAllFiles } from "../test-utils";

let tmpDir: TempDir;

jest.mock("@kosko/log");
jest.mock("@kosko/exec-utils");

function setNpmUserAgent(value: string) {
  let origValue: string | undefined;

  beforeEach(() => {
    origValue = process.env.npm_config_user_agent;
    process.env.npm_config_user_agent = value;
  });

  afterEach(() => {
    process.env.npm_config_user_agent = origValue;
  });
}

async function execute(args: Partial<Arguments>): Promise<void> {
  await command.handler({
    // Disable interactive mode by default
    interactive: false,
    ...(args as any)
  });
}

beforeEach(async () => {
  tmpDir = await makeTempDir();
});

afterEach(() => tmpDir.cleanup());

describe("when the target exists and is not a directory", () => {
  let tmpFile: TempFile;

  beforeEach(async () => {
    tmpFile = await makeTempFile();
  });

  afterEach(() => tmpFile.cleanup());

  test("should throw an error", async () => {
    await expect(execute({ path: tmpFile.path })).rejects.toThrow(
      "Destination already exists and is not a directory"
    );
  });
});

describe("when the target exists and is not empty", () => {
  beforeEach(async () => {
    await writeFile(join(tmpDir.path, "test"), "foobar");
  });

  test("should throw an error without --force option", async () => {
    await expect(execute({ path: tmpDir.path })).rejects.toThrow(
      "Destination already exists"
    );
  });

  test("should proceed with --force option", async () => {
    await expect(execute({ path: tmpDir.path, force: true })).toResolve();
  });

  test("should update package.json", async () => {
    const packageJsonPath = join(tmpDir.path, "package.json");

    await writeFile(
      packageJsonPath,
      stringify(
        {
          name: "foo",
          version: "1.2.3",
          dependencies: {
            debug: "3.2.1"
          }
        },
        undefined,
        "  "
      )
    );
    await expect(execute({ path: tmpDir.path, force: true })).toResolve();
    await expect(readFile(packageJsonPath, "utf8")).resolves.toMatchSnapshot();
  });
});

describe("when the target exists and existing files can be ignored", () => {
  beforeEach(async () => {
    await writeFile(join(tmpDir.path, ".DS_Store"), "");
  });

  test("should succeed", async () => {
    await expect(execute({ path: tmpDir.path })).toResolve();
  });

  test("should throw an error if other unignorable files exist", async () => {
    await writeFile(join(tmpDir.path, "test"), "foobar");
    await expect(execute({ path: tmpDir.path })).rejects.toThrow(
      "Destination already exists"
    );
  });
});

describe("when the target exists and only git folder exist", () => {
  beforeEach(async () => {
    await mkdir(join(tmpDir.path, ".git"));
  });

  test("should succeed", async () => {
    await expect(execute({ path: tmpDir.path })).toResolve();
  });
});

describe("when the target exists and only contain log files", () => {
  beforeEach(async () => {
    await writeFile(join(tmpDir.path, "npm.log"), "foo");
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

    const stats = await stat(join(tmpDir.path, "foo"));
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

  test("should not run install", () => {
    expect(spawn).not.toHaveBeenCalled();
  });

  test("should print install command in log", () => {
    expect(logger.log).toHaveBeenCalledWith(
      LogLevel.Info,
      expect.stringContaining("npm install @kosko/env kosko kubernetes-models")
    );
  });
});

describe("when --install option is given", () => {
  setNpmUserAgent("npm");

  beforeEach(async () => {
    await execute({ path: tmpDir.path, install: true });
  });

  test("should run install in the folder", async () => {
    const spawnOptions = {
      cwd: tmpDir.path,
      stdio: "inherit",
      env: {
        ...process.env,
        ADBLOCK: "1",
        DISABLE_OPENCOLLECTIVE: "1"
      }
    };
    expect(spawn).toHaveBeenCalledTimes(2);
    expect(spawn).toHaveBeenCalledWith(
      "npm",
      ["install", "@kosko/env", "kosko", "kubernetes-models"],
      spawnOptions
    );
    expect(spawn).toHaveBeenCalledWith(
      "npm",
      ["install", "ts-node", "typescript", "@tsconfig/node-lts", "--save-dev"],
      spawnOptions
    );
  });

  test("should not print install command in log", () => {
    expect(logger.log).not.toHaveBeenCalledWith(
      LogLevel.Info,
      expect.stringContaining("npm install")
    );
  });
});

describe("when --typescript = false and --install option is given", () => {
  setNpmUserAgent("npm");

  beforeEach(async () => {
    await execute({ path: tmpDir.path, typescript: false, install: true });
  });

  test("should run install in the folder", async () => {
    expect(spawn).toHaveBeenCalledTimes(1);
    expect(spawn).toHaveBeenCalledWith(
      "npm",
      ["install", "@kosko/env", "kosko", "kubernetes-models"],
      {
        cwd: tmpDir.path,
        stdio: "inherit",
        env: {
          ...process.env,
          ADBLOCK: "1",
          DISABLE_OPENCOLLECTIVE: "1"
        }
      }
    );
  });

  test("should not print install command in log", () => {
    expect(logger.log).not.toHaveBeenCalledWith(
      LogLevel.Info,
      expect.stringContaining("npm install")
    );
  });
});

describe("when --typescript = false and --esm option is given", () => {
  beforeEach(async () => {
    await execute({ path: tmpDir.path, typescript: false, esm: true });
  });

  test("should generate files", async () => {
    await expect(listAllFiles(tmpDir.path)).resolves.toMatchSnapshot();
  });

  test("should print install command in log", () => {
    expect(logger.log).toHaveBeenCalledWith(
      LogLevel.Info,
      expect.stringContaining("npm install @kosko/env kosko kubernetes-models")
    );
  });
});

describe("when --typescript = true", () => {
  beforeEach(async () => {
    await execute({ path: tmpDir.path, typescript: true });
  });

  test("should generate files", async () => {
    await expect(listAllFiles(tmpDir.path)).resolves.toMatchSnapshot();
  });

  test("should print install command in log", () => {
    expect(logger.log).toHaveBeenCalledWith(
      LogLevel.Info,
      expect.stringContaining("npm install @kosko/env kosko kubernetes-models")
    );
    expect(logger.log).toHaveBeenCalledWith(
      LogLevel.Info,
      expect.stringContaining(
        "npm install ts-node typescript @tsconfig/node-lts --save-dev"
      )
    );
  });
});

describe("when --typescript = false", () => {
  beforeEach(async () => {
    await execute({ path: tmpDir.path, typescript: true });
  });

  test("should generate files", async () => {
    await expect(listAllFiles(tmpDir.path)).resolves.toMatchSnapshot();
  });

  test("should print install command in log", () => {
    expect(logger.log).toHaveBeenCalledWith(
      LogLevel.Info,
      expect.stringContaining("npm install @kosko/env kosko kubernetes-models")
    );
  });
});

describe("when --esm option is given", () => {
  beforeEach(async () => {
    await execute({ path: tmpDir.path, esm: true });
  });

  test("should generate files", async () => {
    await expect(listAllFiles(tmpDir.path)).resolves.toMatchSnapshot();
  });

  test("should print install command in log", () => {
    expect(logger.log).toHaveBeenCalledWith(
      LogLevel.Info,
      expect.stringContaining("npm install @kosko/env kosko kubernetes-models")
    );
    expect(logger.log).toHaveBeenCalledWith(
      LogLevel.Info,
      expect.stringContaining(
        "npm install ts-node typescript @tsconfig/node-lts --save-dev"
      )
    );
  });
});

describe.each([
  {
    packageManager: "npm",
    installCommand: "install",
    devFlag: "--save-dev"
  },
  {
    packageManager: "yarn",
    installCommand: "add",
    devFlag: "--dev"
  },
  {
    packageManager: "pnpm",
    installCommand: "install",
    devFlag: "--save-dev"
  }
])(
  "when --package-manager is $packageManager",
  ({ packageManager, installCommand, devFlag }) => {
    describe("when install = false", () => {
      test("should print install command in log", async () => {
        await execute({ path: tmpDir.path, typescript: true, packageManager });
        expect(logger.log).toHaveBeenCalledWith(
          LogLevel.Info,
          expect.stringContaining(
            `${packageManager} ${installCommand} @kosko/env kosko kubernetes-models`
          )
        );
        expect(logger.log).toHaveBeenCalledWith(
          LogLevel.Info,
          expect.stringContaining(
            `${packageManager} ${installCommand} ts-node typescript @tsconfig/node-lts ${devFlag}`
          )
        );
      });
    });

    describe("when install = true", () => {
      test("should run install in folder", async () => {
        const spawnOptions = {
          cwd: tmpDir.path,
          stdio: "inherit",
          env: {
            ...process.env,
            ADBLOCK: "1",
            DISABLE_OPENCOLLECTIVE: "1"
          }
        };

        await execute({
          path: tmpDir.path,
          typescript: true,
          packageManager,
          install: true
        });
        expect(spawn).toHaveBeenCalledTimes(2);
        expect(spawn).toHaveBeenCalledWith(
          packageManager,
          [installCommand, "@kosko/env", "kosko", "kubernetes-models"],
          spawnOptions
        );
        expect(spawn).toHaveBeenCalledWith(
          packageManager,
          [
            installCommand,
            "ts-node",
            "typescript",
            "@tsconfig/node-lts",
            devFlag
          ],
          spawnOptions
        );
      });
    });
  }
);

describe.each(["npm", "yarn", "pnpm"])(
  "when --package-manager is not given and npm user agent is set to %s",
  (packageManager) => {
    setNpmUserAgent(packageManager);

    beforeEach(async () => {
      await execute({ path: tmpDir.path, install: true, force: true });
    });

    test(`should install dependencies with ${packageManager}`, () => {
      expect(spawn).toHaveBeenCalledWith(
        packageManager,
        expect.anything(),
        expect.anything()
      );
    });
  }
);
