import { loadChart } from "../load";
import { join } from "path";

const FIXTURE_DIR = join(__dirname, "../__fixtures__");
const NGINX_CHART = join(FIXTURE_DIR, "nginx");

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
