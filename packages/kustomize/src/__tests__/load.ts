import { join } from "path";
import tmp from "tmp-promise";
import tempDir from "temp-dir";
import which from "which";
import fs from "fs-extra";
import { loadKustomize } from "../load";
import { SpawnOptions } from "child_process";

const FIXTURE_DIR = join(__dirname, "../__fixtures__");
const HELLO_WORLD = join(FIXTURE_DIR, "hello-world");

let spawnOptions: SpawnOptions | undefined;

jest.setTimeout(15000);

jest.mock("cross-spawn", () => {
  const spawn = jest.requireActual("cross-spawn");

  return (command: string, args: string[]) => {
    return spawn(command, args, spawnOptions);
  };
});

beforeEach(() => {
  spawnOptions = undefined;

  jest.resetAllMocks();
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

describe("when buildCommand is given", () => {
  test("command does not exist", async () => {
    const result = loadKustomize({
      path: HELLO_WORLD,
      buildCommand: ["foo"]
    });

    await expect(result()).rejects.toThrow("ENOENT");
  });

  test("kustomize", async () => {
    const result = loadKustomize({
      path: HELLO_WORLD,
      buildCommand: ["kustomize", "build"]
    });

    await expect(result()).resolves.toHaveLength(3);
  });

  test("kubectl", async () => {
    const result = loadKustomize({
      path: HELLO_WORLD,
      buildCommand: ["kubectl", "kustomize"]
    });

    await expect(result()).resolves.toHaveLength(3);
  });
});

describe("when buildCommand is not given", () => {
  let tmpDir: tmp.DirectoryResult;

  async function linkBins(bins: readonly string[]) {
    for (const bin of bins) {
      await fs.ensureSymlink(await which(bin), join(tmpDir.path, bin));
    }
  }

  beforeEach(async () => {
    tmpDir = await tmp.dir({ tmpdir: tempDir, unsafeCleanup: true });

    spawnOptions = {
      env: {
        ...process.env,
        // Override `PATH` environment variable so we can simulate `kustomize`
        // or `kubectl` CLI not installed in the environment.
        PATH: tmpDir.path
      }
    };
  });

  afterEach(async () => {
    await tmpDir.cleanup();
  });

  test("kustomize", async () => {
    await linkBins(["kustomize"]);

    const result = loadKustomize({ path: HELLO_WORLD });
    await expect(result()).resolves.toHaveLength(3);
  });

  test("kubectl", async () => {
    await linkBins(["kubectl"]);

    const result = loadKustomize({ path: HELLO_WORLD });
    await expect(result()).resolves.toHaveLength(3);
  });

  test("Both are installed", async () => {
    await linkBins(["kustomize", "kubectl"]);

    const result = loadKustomize({ path: HELLO_WORLD });
    await expect(result()).resolves.toHaveLength(3);
  });

  test("Neither is installed", async () => {
    const result = loadKustomize({ path: HELLO_WORLD });
    await expect(result()).rejects.toThrow(
      `"loadKustomize" requires either kustomize or kubectl CLI installed in your environment. More info: https://kosko.dev/docs/loading-kustomize`
    );
  });
});
