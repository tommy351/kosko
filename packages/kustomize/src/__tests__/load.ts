/// <reference types="jest-extended"/>
import { join } from "node:path";
import { loadKustomize, resetCachedBuildCommand } from "../load";
import { spawn } from "@kosko/exec-utils";

const mockedSpawn = jest.mocked(spawn);

const FIXTURE_DIR = join(__dirname, "../__fixtures__");
const HELLO_WORLD = join(FIXTURE_DIR, "hello-world");

jest.setTimeout(15000);

jest.mock("@kosko/exec-utils", () => {
  const mod = jest.requireActual("@kosko/exec-utils");

  return {
    ...mod,
    spawn: jest.fn()
  };
});

function useRealSpawn() {
  mockedSpawn.mockImplementation(jest.requireActual("@kosko/exec-utils").spawn);
}

beforeEach(() => {
  useRealSpawn();
});

afterEach(() => {
  resetCachedBuildCommand();
});

test("local path", async () => {
  const result = loadKustomize({ path: HELLO_WORLD });
  await expect(result()).resolves.toMatchSnapshot();
});

test("remote url", async () => {
  const result = loadKustomize({
    path: "github.com/kustless/kustomize-examples"
  });

  await expect(result()).resolves.toMatchSnapshot();
});

test("helm chart", async () => {
  const result = loadKustomize({
    path: join(FIXTURE_DIR, "helm"),
    enableHelm: true
  });

  await expect(result()).resolves.toMatchSnapshot();
});

test("when path does not exist", async () => {
  const result = loadKustomize({
    path: join(FIXTURE_DIR, "not-exist")
  });

  await expect(result()).rejects.toThrow();
});

describe("when buildCommand is given", () => {
  test("command exists", async () => {
    mockedSpawn.mockResolvedValueOnce({
      stdout: `
apiVersion: v1
kind: Pod
metadata:
  name: test
`,
      stderr: ""
    });
    const result = loadKustomize({
      path: HELLO_WORLD,
      buildCommand: ["foo", "abc", "def"]
    });

    await expect(result()).resolves.toMatchSnapshot();
    expect(spawn).toHaveBeenCalledTimes(1);
    expect(spawn).toHaveBeenCalledWith("foo", ["abc", "def", HELLO_WORLD]);
  });

  test("command does not exist", async () => {
    mockedSpawn.mockRejectedValue(
      Object.assign(new Error("spawn foo ENOENT"), {
        code: "ENOENT"
      })
    );
    const result = loadKustomize({
      path: HELLO_WORLD,
      buildCommand: ["foo", "abc", "def"]
    });

    await expect(result()).rejects.toThrow(
      `"foo" is not installed in your environment`
    );
    expect(spawn).toHaveBeenCalledTimes(1);
    expect(spawn).toHaveBeenCalledWith("foo", ["abc", "def", HELLO_WORLD]);
  });
});

describe("when buildCommand is not given", () => {
  function allowCommands(commands: readonly string[]) {
    const realSpawn = jest.requireActual("@kosko/exec-utils").spawn;

    mockedSpawn.mockImplementation(async (command, args) => {
      if (commands.includes(command)) {
        return realSpawn(command, args);
      }

      throw Object.assign(new Error(`spawn ${command} ENOENT`), {
        code: "ENOENT"
      });
    });
  }

  test("kustomize", async () => {
    allowCommands(["kustomize"]);

    const result = loadKustomize({ path: HELLO_WORLD });
    await expect(result()).resolves.toHaveLength(3);
    expect(spawn).toHaveBeenCalledTimes(1);
    expect(spawn).toHaveBeenCalledWith("kustomize", ["build", HELLO_WORLD]);
  });

  test("kubectl", async () => {
    allowCommands(["kubectl"]);

    const result = loadKustomize({ path: HELLO_WORLD });
    await expect(result()).resolves.toHaveLength(3);
    expect(spawn).toHaveBeenCalledTimes(2);
    expect(spawn).toHaveBeenLastCalledWith("kubectl", [
      "kustomize",
      HELLO_WORLD
    ]);
  });

  test("Both are installed", async () => {
    allowCommands(["kustomize", "kubectl"]);

    const result = loadKustomize({ path: HELLO_WORLD });
    await expect(result()).resolves.toHaveLength(3);
    expect(spawn).toHaveBeenCalledTimes(1);
    expect(spawn).toHaveBeenCalledWith("kustomize", ["build", HELLO_WORLD]);
  });

  test("Neither is installed", async () => {
    allowCommands([]);

    const result = loadKustomize({ path: HELLO_WORLD });
    await expect(result()).rejects.toThrow(
      `"loadKustomize" requires either kustomize or kubectl CLI installed in your environment. More info: https://kosko.dev/docs/components/loading-kustomize`
    );
  });

  test("should use cached build command after the first call", async () => {
    allowCommands(["kubectl"]);

    const result = loadKustomize({ path: HELLO_WORLD });

    // First call
    await result();

    // Spawn should be called twice at first because we tried kustomize then kubectl
    expect(spawn).toHaveBeenCalledTimes(2);

    // Clear call history of the mock
    mockedSpawn.mockClear();

    // Second call
    await result();

    // Spawn should be called only once because cached build command is used
    expect(spawn).toHaveBeenCalledOnce();
  });

  test("should reset cache if cached build command throws ENOENT", async () => {
    const result = loadKustomize({ path: HELLO_WORLD });

    // We want to use kustomize in first call
    allowCommands(["kustomize"]);

    // First call
    await result();

    // Clear call history of the mock
    mockedSpawn.mockClear();

    // Now we want to use kubectl
    allowCommands(["kubectl"]);

    // Second call
    await result();

    // Spawn should be called three times:
    // 1. Try the cached build command (kustomize) and failed
    // 2. Try kustomize and failed
    // 3. Try kubectl and finally succeeded
    expect(spawn).toHaveBeenCalledTimes(3);
  });
});
