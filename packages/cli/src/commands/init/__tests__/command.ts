/// <reference types="jest-extended"/>
import { InitArguments, initCmd } from "../command";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { join, posix } from "node:path";
import glob from "fast-glob";
import { spawn } from "@kosko/exec-utils";
import stringify from "fast-safe-stringify";
import {
  makeTempDir,
  makeTempFile,
  TempDir,
  TempFile
} from "@kosko/test-utils";
import logger, { LogLevel } from "@kosko/log";

let tmpDir: TempDir;

jest.mock("@kosko/log");
jest.mock("@kosko/exec-utils");

async function execute(args: Partial<InitArguments>): Promise<void> {
  await initCmd.handler(args as any);
}

async function listAllFiles(dir: string): Promise<Record<string, string>> {
  const paths = await glob("**/*", { cwd: dir });
  const files: Record<string, string> = {};

  for (const path of paths) {
    files[posix.normalize(path)] = await readFile(join(dir, path), "utf8");
  }

  return files;
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
  beforeEach(async () => {
    await execute({ path: tmpDir.path, install: true });
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
  });
});

describe("when --typescript option is given", () => {
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
        "npm install ts-node typescript @tsconfig/recommended --save-dev"
      )
    );
  });
});

describe("when --typescript and --esm option is given", () => {
  beforeEach(async () => {
    await execute({ path: tmpDir.path, typescript: true, esm: true });
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
        "npm install ts-node typescript @tsconfig/node16-strictest-esm --save-dev"
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
            `${packageManager} ${installCommand} ts-node typescript @tsconfig/recommended ${devFlag}`
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
            "@tsconfig/recommended",
            devFlag
          ],
          spawnOptions
        );
      });
    });
  }
);

describe.each([
  { file: "yarn.lock", packageManager: "yarn" },
  { file: "pnpm-lock.yaml", packageManager: "pnpm" }
])(
  "when --package-manager is not given but file $file exists",
  ({ file, packageManager }) => {
    beforeEach(async () => {
      await writeFile(join(tmpDir.path, file), "");
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
