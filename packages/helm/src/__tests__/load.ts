/// <reference types="jest-extended" />
import { loadChart } from "../load";
import { join } from "node:path";
import { spawn } from "@kosko/exec-utils";
import tmp from "tmp-promise";
import { readdir, writeFile } from "node:fs/promises";
import { Pod } from "kubernetes-models/v1/Pod";
import { Manifest } from "@kosko/yaml";

jest.mock("@kosko/exec-utils", () => {
  const actual = jest.requireActual("@kosko/exec-utils");

  return {
    ...actual,
    spawn: jest.fn()
  };
});

const FIXTURE_DIR = join(__dirname, "../__fixtures__");
const NGINX_CHART = join(FIXTURE_DIR, "nginx");

const mockedSpawn = jest.mocked(spawn);

jest.setTimeout(15000);

beforeEach(() => {
  mockedSpawn.mockImplementation(jest.requireActual("@kosko/exec-utils").spawn);
});

test("chart is a local path", async () => {
  const result = loadChart({ chart: NGINX_CHART });
  await expect(result()).resolves.toMatchSnapshot();
});

test("invalid local chart path", async () => {
  const result = loadChart({ chart: FIXTURE_DIR });
  await expect(result()).rejects.toThrow();
});

test("chart is a local tarball", async () => {
  const result = loadChart({
    chart: join(FIXTURE_DIR, "tar", "prometheus-25.22.0.tgz")
  });
  await expect(result()).resolves.toMatchSnapshot();
});

test("invalid local tarball", async () => {
  const result = loadChart({ chart: join(FIXTURE_DIR, "tar", "bad-tar.tgz") });
  await expect(result()).rejects.toThrow();
});

test("chart is remote", async () => {
  const result = loadChart({
    chart: "prometheus",
    repo: "https://prometheus-community.github.io/helm-charts",
    version: "13.6.0"
  });

  await expect(result()).resolves.toMatchSnapshot();
});

test("chart is deprecated", async () => {
  const result = loadChart({
    chart: join(FIXTURE_DIR, "deprecated")
  });

  await expect(result()).resolves.toMatchSnapshot();
});

test("name is specified", async () => {
  const result = loadChart({ chart: NGINX_CHART, name: "foobar" });
  await expect(result()).resolves.toMatchSnapshot();
});

test("values are specified", async () => {
  const result = loadChart({
    chart: NGINX_CHART,
    values: {
      // Number
      replicaCount: 5,
      // String
      nameOverride: "good-day",
      // Object
      serviceAccount: { create: false },
      // Array
      imagePullSecrets: [{ name: "docker-hub" }]
    }
  });

  await expect(result()).resolves.toMatchSnapshot();
});

describe("version option", () => {
  test("version is not specified", async () => {
    const result = loadChart({
      chart: "prometheus",
      repo: "https://prometheus-community.github.io/helm-charts"
    });

    await expect(result()).resolves.not.toBeEmpty();
  });

  test("version is a semver range", async () => {
    const result = loadChart({
      chart: "prometheus",
      repo: "https://prometheus-community.github.io/helm-charts",
      version: "^23.0.0"
    });

    await expect(result()).resolves.not.toBeEmpty();
  });
});

describe("includeCrds option", () => {
  test("should not include CRDs when includeCrds is not set", async () => {
    const result = loadChart({
      chart: join(FIXTURE_DIR, "crd")
    });

    await expect(result()).resolves.toBeEmpty();
  });

  test("should not include CRDs when includeCrds is false", async () => {
    const result = loadChart({
      chart: join(FIXTURE_DIR, "crd"),
      includeCrds: false
    });

    await expect(result()).resolves.toBeEmpty();
  });

  test("should include CRDs when includeCrds is true", async () => {
    const result = loadChart({
      chart: join(FIXTURE_DIR, "crd"),
      includeCrds: true
    });

    await expect(result()).resolves.not.toBeEmpty();
  });
});

describe("skipTests option", () => {
  test("should include tests by default", async () => {
    const result = loadChart({
      chart: join(FIXTURE_DIR, "tests")
    });

    await expect(result()).resolves.not.toBeEmpty();
  });

  test("should include tests when skipTests is false", async () => {
    const result = loadChart({
      chart: join(FIXTURE_DIR, "tests"),
      skipTests: false
    });

    await expect(result()).resolves.not.toBeEmpty();
  });

  test("should exclude tests when skipTests is true", async () => {
    const result = loadChart({
      chart: join(FIXTURE_DIR, "tests"),
      skipTests: true
    });

    await expect(result()).resolves.toBeEmpty();
  });
});

describe("isUpgrade option", () => {
  test("should not set is-upgrade by default", async () => {
    const result = loadChart({
      chart: join(FIXTURE_DIR, "upgrade")
    });
    const manifests = await result();

    expect(manifests).toEqual([
      new Pod({
        metadata: {
          name: "foo",
          annotations: {
            "is-upgrade": "false",
            "is-install": "true"
          }
        }
      })
    ]);
  });

  test("should not set is-upgrade if isUpgrade is false", async () => {
    const result = loadChart({
      chart: join(FIXTURE_DIR, "upgrade"),
      isUpgrade: false
    });
    const manifests = await result();

    expect(manifests).toEqual([
      new Pod({
        metadata: {
          name: "foo",
          annotations: {
            "is-upgrade": "false",
            "is-install": "true"
          }
        }
      })
    ]);
  });

  test("should set is-upgrade if isUpgrade is true", async () => {
    const result = loadChart({
      chart: join(FIXTURE_DIR, "upgrade"),
      isUpgrade: true
    });
    const manifests = await result();

    expect(manifests).toEqual([
      new Pod({
        metadata: {
          name: "foo",
          annotations: {
            "is-upgrade": "true",
            "is-install": "false"
          }
        }
      })
    ]);
  });
});

describe("kubeVersion is specified", () => {
  test("should set kube-version when kubeVersion is specified", async () => {
    const result = loadChart({
      chart: join(FIXTURE_DIR, "kube-version"),
      kubeVersion: "1.22.0"
    });
    const manifests = await result();

    expect(manifests).toEqual([
      new Pod({
        metadata: {
          name: "foo",
          annotations: {
            "kube-version": "v1.22.0"
          }
        }
      })
    ]);
  });
});

test("insecureSkipTlsVerify is true", async () => {
  const result = loadChart({
    chart: NGINX_CHART,
    insecureSkipTlsVerify: true
  });

  await result();
  expect(mockedSpawn.mock.calls[0][1]).toContain("--insecure-skip-tls-verify");
});

test("passCredentials is true", async () => {
  const result = loadChart({
    chart: NGINX_CHART,
    passCredentials: true
  });

  await result();
  expect(mockedSpawn.mock.calls[0][1]).toContain("--pass-credentials");
});

test("postRenderer is specified", async () => {
  const result = loadChart({
    chart: join(FIXTURE_DIR, "upgrade"),
    postRenderer: "node",
    postRendererArgs: [join(FIXTURE_DIR, "post-renderer.js")]
  });

  await expect(result()).resolves.toEqual([
    new Pod({
      metadata: {
        name: "header"
      }
    }),
    new Pod({
      metadata: {
        name: "foo",
        annotations: {
          "is-upgrade": "false",
          "is-install": "true"
        }
      }
    })
  ]);
});

test("spawn throws ENOENT error", async () => {
  const err = Object.assign(new Error("spawn helm ENOENT"), { code: "ENOENT" });
  mockedSpawn.mockRejectedValue(err);

  await expect(
    loadChart({
      chart: join(FIXTURE_DIR, "deprecated")
    })
  ).rejects.toThrow(
    `"loadChart" requires Helm CLI installed in your environment. More info: https://kosko.dev/docs/components/loading-helm-chart`
  );
});

test("OCI chart", async () => {
  const result = loadChart({
    chart: "oci://ghcr.io/prometheus-community/charts/prometheus",
    version: "25.1.0"
  });

  await expect(result()).resolves.toMatchSnapshot();
});

describe("when cache is disabled", () => {
  let tmpDir: tmp.DirectoryResult;

  beforeEach(async () => {
    tmpDir = await tmp.dir({ unsafeCleanup: true });
  });

  afterEach(async () => {
    await tmpDir.cleanup();
  });

  test("should not cache chart", async () => {
    const result = loadChart({
      chart: "prometheus",
      repo: "https://prometheus-community.github.io/helm-charts",
      version: "13.6.0",
      cache: { enabled: false, dir: tmpDir.path }
    });

    await expect(result()).resolves.not.toBeEmpty();

    // Cache directory should be empty
    await expect(readdir(tmpDir.path)).resolves.toBeEmpty();
  });
});

describe("when cache directory is specified", () => {
  let tmpDir: tmp.DirectoryResult;

  beforeEach(async () => {
    tmpDir = await tmp.dir({ unsafeCleanup: true });
  });

  afterEach(async () => {
    await tmpDir.cleanup();
  });

  test("should store cache in the specified directory", async () => {
    const result = loadChart({
      chart: "prometheus",
      repo: "https://prometheus-community.github.io/helm-charts",
      version: "13.6.0",
      cache: { dir: tmpDir.path }
    });

    await expect(result()).resolves.not.toBeEmpty();

    // Cache directory should not be empty
    await expect(readdir(tmpDir.path)).resolves.not.toBeEmpty();
  });
});

describe("when KOSKO_HELM_CACHE_DIR is set", () => {
  let tmpDir: tmp.DirectoryResult;
  let origEnv: string | undefined;

  beforeEach(async () => {
    tmpDir = await tmp.dir({ unsafeCleanup: true });
    origEnv = process.env.KOSKO_HELM_CACHE_DIR;
    process.env.KOSKO_HELM_CACHE_DIR = tmpDir.path;
  });

  afterEach(async () => {
    await tmpDir.cleanup();
    process.env.KOSKO_HELM_CACHE_DIR = origEnv;
  });

  test("should store cache in the specified directory", async () => {
    const result = loadChart({
      chart: "prometheus",
      repo: "https://prometheus-community.github.io/helm-charts",
      version: "13.6.0"
    });

    await expect(result()).resolves.not.toBeEmpty();

    // Cache directory should not be empty
    await expect(readdir(tmpDir.path)).resolves.not.toBeEmpty();
  });
});

describe("when cache directory does not exist", () => {
  let tmpDir: tmp.DirectoryResult;

  beforeEach(async () => {
    tmpDir = await tmp.dir({ unsafeCleanup: true });
  });

  afterEach(async () => {
    await tmpDir.cleanup();
  });

  test("should create cache directory", async () => {
    const cacheDir = join(tmpDir.path, "cache");
    const result = loadChart({
      chart: "prometheus",
      repo: "https://prometheus-community.github.io/helm-charts",
      version: "13.6.0",
      cache: { dir: cacheDir }
    });

    await expect(result()).resolves.not.toBeEmpty();

    // Cache directory should not be empty
    await expect(readdir(cacheDir)).resolves.not.toBeEmpty();
  });
});

describe("concurrent pull", () => {
  let tmpDir: tmp.DirectoryResult;

  beforeEach(async () => {
    tmpDir = await tmp.dir({ unsafeCleanup: true });
  });

  afterEach(async () => {
    await tmpDir.cleanup();
  });

  test("should not throw error", async () => {
    const promises: Promise<Manifest[]>[] = [];

    for (let i = 0; i < 2; i++) {
      promises.push(
        loadChart({
          chart: "prometheus",
          repo: "https://prometheus-community.github.io/helm-charts",
          version: "13.6.0",
          // Set cache directory to a temporary directory because we don't want
          // to use existing cache.
          cache: { dir: tmpDir.path }
        })()
      );
    }

    await expect(Promise.all(promises)).resolves.toSatisfyAll(
      (result) => result.length > 0
    );
  });
});

describe("cache reuse", () => {
  let tmpDir: tmp.DirectoryResult;

  async function load(version: string) {
    return loadChart({
      chart: "prometheus",
      repo: "https://prometheus-community.github.io/helm-charts",
      version,
      cache: { dir: tmpDir.path }
    })();
  }

  function getPullCalls() {
    return mockedSpawn.mock.calls.filter((call) => call[1]?.[0] === "pull");
  }

  beforeEach(async () => {
    tmpDir = await tmp.dir({ unsafeCleanup: true });
  });

  afterEach(async () => {
    await tmpDir.cleanup();
  });

  test("should use cache if hit", async () => {
    const first = await load("13.6.0");
    const second = await load("13.6.0");

    expect(second).toEqual(first);

    // `helm pull` should only be called in the first run
    expect(getPullCalls()).toHaveLength(1);
  });

  test("should not use cache if miss", async () => {
    const first = await load("13.6.0");
    const second = await load("13.8.0");

    expect(second).not.toEqual(first);

    // `helm pull` should be called twice
    expect(getPullCalls()).toHaveLength(2);
  });
});

describe("when index file is empty", () => {
  let tmpDir: tmp.DirectoryResult;

  beforeEach(async () => {
    tmpDir = await tmp.dir({ unsafeCleanup: true });
  });

  afterEach(async () => {
    await tmpDir.cleanup();
  });

  test("should not use cache", async () => {
    const run = async () => {
      const result = loadChart({
        chart: "prometheus",
        repo: "https://prometheus-community.github.io/helm-charts",
        version: "13.6.0",
        cache: { dir: tmpDir.path }
      });

      await expect(result()).resolves.not.toBeEmpty();
    };

    await run();

    const filenames = await readdir(tmpDir.path);
    const indexFilename = filenames.find((filename) =>
      filename.startsWith("index")
    );
    await writeFile(join(tmpDir.path, indexFilename!), "");

    await run();
  });
});
