import { ChartOptions, loadChart } from "../load";
import { join } from "node:path";
import { Manifest } from "@kosko/yaml";
import { spawn } from "@kosko/exec-utils";

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

describe("includeCrds option", () => {
  const baseOptions: ChartOptions = {
    chart: "traefik",
    repo: "https://helm.traefik.io/traefik",
    version: "v10.6.1"
  };

  function pickCrds(manifests: readonly Manifest[]): Manifest[] {
    return manifests.filter((m) => m.kind === "CustomResourceDefinition");
  }

  test("should not include CRDs when includeCrds is not set", async () => {
    const result = loadChart(baseOptions);

    expect(pickCrds(await result())).toHaveLength(0);
  });

  test("should include CRDs when includeCrds is set", async () => {
    const result = loadChart({
      ...baseOptions,
      includeCrds: true
    });

    expect(pickCrds(await result())).not.toHaveLength(0);
  });
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
