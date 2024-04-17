import { LoadOptions, loadString, Manifest } from "@kosko/yaml";
import tmp from "tmp-promise";
import { writeFile, stat, mkdir } from "node:fs/promises";
import {
  spawn,
  booleanArg,
  stringArg,
  stringArrayArg
} from "@kosko/exec-utils";
import stringify from "fast-safe-stringify";
import { getErrorCode } from "@kosko/common-utils";
import getCacheDir from "cachedir";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { Stats } from "node:fs";

const cacheDir = getCacheDir("kosko-helm");

/**
 * @public
 */
export interface PullOptions {
  /**
   * The path of a local chart or the name of a remote chart.
   */
  chart: string;

  /**
   * Verify certificates of HTTPS-enabled servers using this CA bundle.
   */
  caFile?: string;

  /**
   * Identify HTTPS client using this SSL certificate file.
   */
  certFile?: string;

  /**
   * Use development versions, too. Equivalent to version '\>0.0.0-0'. If
   * `version` is set, this is ignored.
   */
  devel?: boolean;

  /**
   * Identify HTTPS client using this SSL key file.
   */
  keyFile?: string;

  /**
   * Location of public keys used for verification.
   *
   * @defaultValue `~/.gnupg/pubring.gpg`
   */
  keyring?: string;

  /**
   * Chart repository password where to locate the requested chart.
   */
  password?: string;

  /**
   * Chart repository url where to locate the requested chart.
   */
  repo?: string;

  /**
   * Chart repository username where to locate the requested chart.
   */
  username?: string;

  /**
   * Verify the package before using it.
   */
  verify?: boolean;

  /**
   * Specify the exact chart version to use. If this is not specified, the
   * latest version is used.
   */
  version?: string;
}

/**
 * @public
 */
export interface TemplateOptions {
  /**
   * Name of the release.
   */
  name?: string;

  /**
   * Kubernetes API versions used for `Capabilities.APIVersions`.
   */
  apiVersions?: string[];

  /**
   * Run helm dependency update before installing the chart.
   */
  dependencyUpdate?: boolean;

  /**
   * Add a custom description.
   */
  description?: string;

  /**
   * Generate the name (and omit the `name` parameter).
   */
  generateName?: boolean;

  /**
   * Specify template used to name the release.
   */
  nameTemplate?: string;

  /**
   * Namespace scope for this request.
   */
  namespace?: string;

  /**
   * Prevent hooks from running during install.
   */
  noHooks?: boolean;

  /**
   * Include CRDs in the templated output.
   */
  includeCrds?: boolean;

  /**
   * Skip tests from templated output.
   */
  skipTests?: boolean;

  /**
   * Time to wait for any individual Kubernetes operation (like Jobs for hooks)
   *
   * @defaultValue `5m0s`
   */
  timeout?: string;

  /**
   * Specify values.
   */
  values?: unknown;
}

function hashPullOptions(options: PullOptions): string {
  const hash = createHash("sha256");

  hash.write(
    JSON.stringify({
      chart: options.chart,
      devel: options.devel,
      repo: options.repo,
      version: options.version
    })
  );

  return hash.digest("hex");
}

async function runHelm(args: readonly string[]) {
  try {
    return await spawn("helm", args);
  } catch (err) {
    if (getErrorCode(err) !== "ENOENT") throw err;

    throw new Error(
      `"loadChart" requires Helm CLI installed in your environment. More info: https://kosko.dev/docs/components/loading-helm-chart`
    );
  }
}

async function maybeStat(path: string): Promise<Stats | undefined> {
  try {
    return await stat(path);
  } catch (err) {
    if (getErrorCode(err) !== "ENOENT") throw err;
  }
}

async function isLocalChart(options: PullOptions): Promise<boolean> {
  if (options.repo) return false;

  const stats = await maybeStat(join(options.chart, "Chart.yaml"));
  return stats?.isFile() ?? false;
}

function getChartBaseName(chart: string): string {
  const index = chart.lastIndexOf("/");

  return index === -1 ? chart : chart.substring(index + 1);
}

async function pullChart(options: PullOptions): Promise<string> {
  if (await isLocalChart(options)) {
    return options.chart;
  }

  const hash = hashPullOptions(options);
  const cachePath = join(cacheDir, hash);
  const name = getChartBaseName(options.chart);
  const chartPath = join(cachePath, name);

  // Check if cache exists
  const stats = await maybeStat(cachePath);
  if (stats?.isDirectory()) return chartPath;

  await mkdir(cachePath, { recursive: true });

  await runHelm([
    "pull",
    options.chart,
    "--untar",
    "--untardir",
    cachePath,
    ...stringArg("ca-file", options.caFile),
    ...stringArg("cert-file", options.certFile),
    ...booleanArg("devel", options.devel),
    ...stringArg("key-file", options.keyFile),
    ...stringArg("keyring", options.keyring),
    ...stringArg("password", options.password),
    ...stringArg("repo", options.repo),
    ...stringArg("username", options.username),
    ...booleanArg("verify", options.verify),
    ...stringArg("version", options.version)
  ]);

  return chartPath;
}

async function writeValues(values: unknown) {
  const file = await tmp.file();

  await writeFile(file.path, stringify(values));

  return file;
}

async function renderChart({
  chart,
  name,
  apiVersions,
  dependencyUpdate,
  description,
  generateName,
  nameTemplate,
  namespace,
  noHooks,
  includeCrds,
  skipTests,
  timeout,
  values
}: Omit<TemplateOptions, "transform"> & { chart: string }) {
  const args: string[] = [
    "template",
    ...(name ? [name] : []),
    chart,
    ...stringArrayArg("api-versions", apiVersions),
    ...booleanArg("dependency-update", dependencyUpdate),
    ...stringArg("description", description),
    ...booleanArg("generate-name", generateName),
    ...stringArg("name-template", nameTemplate),
    ...stringArg("namespace", namespace),
    ...booleanArg("no-hooks", noHooks),
    ...booleanArg("include-crds", includeCrds),
    ...booleanArg("skip-tests", skipTests),
    ...stringArg("timeout", timeout)
  ];
  let valueFile: tmp.FileResult | undefined;

  if (values) {
    valueFile = await writeValues(values);
    args.push("--values", valueFile.path);
  }

  try {
    return await spawn("helm", args);
  } catch (err) {
    if (getErrorCode(err) !== "ENOENT") throw err;

    throw new Error(
      `"loadChart" requires Helm CLI installed in your environment. More info: https://kosko.dev/docs/components/loading-helm-chart`
    );
  } finally {
    await valueFile?.cleanup();
  }
}

/**
 * @public
 */
export interface ChartOptions
  extends LoadOptions,
    PullOptions,
    TemplateOptions {}

/**
 * @public
 */
export function loadChart(options: ChartOptions): () => Promise<Manifest[]> {
  const { transform, ...opts } = options;

  return async () => {
    const chart = await pullChart(opts);
    const { stdout } = await renderChart({ ...opts, chart });

    // Find the first `---` in order to skip deprecation warnings
    const index = stdout.indexOf("---\n");

    return loadString(stdout.substring(index), { transform });
  };
}
