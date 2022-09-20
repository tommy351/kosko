import { join } from "path";
import { loadKustomize } from "../load";
import { spawn } from "@kosko/exec-utils";

const mockSpawn = spawn as jest.MockedFunction<typeof spawn>;

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
  mockSpawn.mockImplementation(jest.requireActual("@kosko/exec-utils").spawn);
}

beforeEach(() => {
  jest.resetAllMocks();
  useRealSpawn();
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
    mockSpawn.mockResolvedValueOnce({
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
    mockSpawn.mockRejectedValue(
      Object.assign(new Error("spawn foo ENOENT"), {
        code: "ENOENT"
      })
    );
    const result = loadKustomize({
      path: HELLO_WORLD,
      buildCommand: ["foo", "abc", "def"]
    });

    await expect(result()).rejects.toThrow("ENOENT");
    expect(spawn).toHaveBeenCalledTimes(1);
    expect(spawn).toHaveBeenCalledWith("foo", ["abc", "def", HELLO_WORLD]);
  });
});

describe("when buildCommand is not given", () => {
  function allowCommands(commands: readonly string[]) {
    const realSpawn = jest.requireActual("@kosko/exec-utils").spawn;

    mockSpawn.mockImplementation(async (command, args) => {
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
});
