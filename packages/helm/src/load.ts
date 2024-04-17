import { LoadOptions, loadString, Manifest } from "@kosko/yaml";
import tmp from "tmp-promise";
import { writeFile, stat, rename, mkdir } from "node:fs/promises";
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
  const hash = createHash("sha1");

  hash.write(
    JSON.stringify({
      chart: options.chart,
      devel: options.devel,
      repo: options.repo,
      version: options.version
    })
  );

  return hash.digest("base64url").replace(/=+$/, "");
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

async function chartExists(chart: string): Promise<boolean> {
  const stats = await maybeStat(join(chart, "Chart.yaml"));
  return stats?.isFile() ?? false;
}

async function isLocalChart(options: PullOptions): Promise<boolean> {
  return !options.repo && (await chartExists(options.chart));
}

function getChartBaseName(chart: string): string {
  const index = chart.lastIndexOf("/");

  return index === -1 ? chart : chart.substring(index + 1);
}

function getPullArgs(options: PullOptions): string[] {
  return [
    options.chart,
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
  ];
}

async function pullChart(options: PullOptions): Promise<string> {
  if (await isLocalChart(options)) {
    return options.chart;
  }

  const hash = hashPullOptions(options);
  const cachePath = join(cacheDir, hash);

  // Return cache if exists
  if (await chartExists(cachePath)) {
    return cachePath;
  }

  // Create a temporary directory for the chart, because when there are multiple
  // processes pulling the same chart, sometimes Helm fails because files already
  // exist in the cache directory.
  const tmpDir = await tmp.dir({ prefix: "kosko-helm", unsafeCleanup: true });

  try {
    // Pull the chart
    await runHelm([
      "pull",
      ...getPullArgs(options),
      "--untar",
      "--untardir",
      tmpDir.path
    ]);

    // Create the cache directory
    await mkdir(cacheDir, { recursive: true });

    // Move the chart to the cache directory
    try {
      await rename(
        join(tmpDir.path, getChartBaseName(options.chart)),
        cachePath
      );
    } catch (err) {
      // If the cache directory already exists, it probably means that another
      // process has already pulled the chart. In this case, we can ignore the
      // error and return the cache path.
      if (getErrorCode(err) !== "ENOTEMPTY") throw err;
    }

    return cachePath;
  } finally {
    // Clean up the temporary directory
    await tmpDir.cleanup();
  }
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
    return await runHelm(args);
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
