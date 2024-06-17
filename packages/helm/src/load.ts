import { LoadOptions, loadString, Manifest } from "@kosko/yaml";
import tmp from "tmp-promise";
import { writeFile, readFile, mkdir } from "node:fs/promises";
import {
  spawn,
  booleanArg,
  stringArg,
  stringArrayArg
} from "@kosko/exec-utils";
import stringify from "fast-safe-stringify";
import { getErrorCode, isRecord } from "@kosko/common-utils";
import getCacheDir from "cachedir";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { env } from "node:process";
import yaml from "js-yaml";
import { fileExists, move } from "./fs";

const FILE_EXIST_ERROR_CODES = new Set(["EEXIST", "ENOTEMPTY"]);
const OCI_PREFIX = "oci://";

const defaultCacheDir = getCacheDir("kosko-helm");

/**
 * @public
 */
export interface CacheOptions {
  /**
   * When cache is enabled, the chart is pulled and stored in the cache
   * directory. Although Helm has its own cache, implementing our own cache
   * is faster. Local charts are never cached.
   *
   * @defaultValue `true`
   */
  enabled?: boolean;

  /**
   * The path of the cache directory. You can also use `KOSKO_HELM_CACHE_DIR`
   * environment variable to set the cache directory. This option always takes
   * precedence over the environment variable.
   *
   * @defaultValue
   * - Linux: `$XDG_CACHE_HOME/kosko-helm` or `~/.cache/kosko-helm`
   * - macOS: `~/Library/Caches/kosko-helm`
   * - Windows: `$LOCALAPPDATA/kosko-helm` or `~/AppData/Local/kosko-helm`
   */
  dir?: string;
}

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
   * Skip tls certificate checks for the chart download.
   */
  insecureSkipTlsVerify?: boolean;

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
   * Pass credentials to all domains.
   */
  passCredentials?: boolean;

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

  /**
   * Cache options.
   */
  cache?: CacheOptions;
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
   * Include CRDs in the templated output.
   */
  includeCrds?: boolean;

  /**
   * Set `.Release.IsUpgrade` instead of `.Release.IsInstall`.
   */
  isUpgrade?: boolean;

  /**
   * Kubernetes version used for `Capabilities.KubeVersion`.
   */
  kubeVersion?: string;

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
   * The path to an executable to be used for post rendering. If it exists in
   * `$PATH`, the binary will be used, otherwise it will try to look for the
   * executable at the given path.
   */
  postRenderer?: string;

  /**
   * Arguments to the post-renderer.
   *
   * @defaultValue `[]`
   */
  postRendererArgs?: string[];

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

function removeBase64Padding(str: string): string {
  const index = str.indexOf("=");
  return index === -1 ? str : str.substring(0, index);
}

function genHash(value: string): string {
  const hash = createHash("sha1");

  hash.write(value);

  return removeBase64Padding(hash.digest("base64url"));
}

function genObjectHash(value: unknown): string {
  return genHash(stringify(value));
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

function getChartManifestPath(path: string) {
  return join(path, "Chart.yaml");
}

function chartManifestExists(path: string) {
  return fileExists(getChartManifestPath(path));
}

async function isLocalChart(
  options: Pick<PullOptions, "repo" | "chart">
): Promise<boolean> {
  // If repo is set, it's a remote chart
  if (options.repo) return false;

  // OCI charts are always remote
  if (options.chart.startsWith(OCI_PREFIX)) return false;

  return chartManifestExists(options.chart);
}

function getChartBaseName(chart: string): string {
  const index = chart.lastIndexOf("/");

  return index === -1 ? chart : chart.substring(index + 1);
}

async function getChartMetadata(
  chart: string
): Promise<Record<string, unknown> | undefined> {
  try {
    const content = await readFile(getChartManifestPath(chart), "utf8");
    const metadata = yaml.load(content);

    if (isRecord(metadata)) return metadata;
  } catch (err) {
    if (getErrorCode(err) !== "ENOENT") throw err;
  }
}

function getPullArgs(options: PullOptions): string[] {
  return [
    options.chart,
    ...stringArg("ca-file", options.caFile),
    ...stringArg("cert-file", options.certFile),
    ...booleanArg("devel", options.devel),
    ...booleanArg("insecure-skip-tls-verify", options.insecureSkipTlsVerify),
    ...stringArg("key-file", options.keyFile),
    ...stringArg("keyring", options.keyring),
    ...booleanArg("pass-credentials", options.passCredentials),
    ...stringArg("password", options.password),
    ...stringArg("repo", options.repo),
    ...stringArg("username", options.username),
    ...booleanArg("verify", options.verify),
    ...stringArg("version", options.version)
  ];
}

async function moveChartToCacheDir(src: string, dest: string): Promise<void> {
  // Skip if the chart already exists in the cache directory
  if (await chartManifestExists(dest)) return;

  await mkdir(dirname(dest), { recursive: true });

  try {
    await move(src, dest);
  } catch (err) {
    const code = getErrorCode(err);

    if (!code) throw err;

    // If the target already exists, it probably means that another
    // process has already pulled the chart. In this case, we can ignore the
    // error and return the cache path.
    if (FILE_EXIST_ERROR_CODES.has(code)) {
      return;
    }

    // Windows throws EPERM error when the target already exists. In this case,
    // we will try to check if the `Chart.yaml` exists in the target directory.
    //
    // https://github.com/nodejs/node/issues/29481
    if (code === "EPERM" && (await chartManifestExists(dest))) {
      return;
    }

    throw err;
  }
}

async function pullChart(options: PullOptions): Promise<string | undefined> {
  // Skip cache if disabled
  if (options.cache?.enabled === false) return;

  // Skip cache if version is not set
  if (!options.version) return;

  // Skip cache if it's a local chart
  if (await isLocalChart(options)) return;

  const cacheDir =
    options.cache?.dir || env.KOSKO_HELM_CACHE_DIR || defaultCacheDir;
  const indexHash = genObjectHash({
    c: options.chart,
    d: options.devel,
    r: options.repo,
    v: options.version
  });
  const indexPath = join(cacheDir, "index-" + indexHash);

  // Read the index file to get the cache path
  try {
    const content = await readFile(indexPath, "utf8");
    if (content) {
      // The content read by current process might be empty due to race condition.
      return join(cacheDir, content);
    }
  } catch (err) {
    if (getErrorCode(err) !== "ENOENT") throw err;
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

    const chartDir = join(tmpDir.path, getChartBaseName(options.chart));

    // Get chart version
    const chartMeta = await getChartMetadata(chartDir);
    const chartVersion = chartMeta?.version;

    if (typeof chartVersion !== "string") return;

    const chartHash = genObjectHash({
      c: options.chart,
      r: options.repo,
      v: chartVersion
    });
    const dest = join(cacheDir, chartHash);

    // Move the chart to the cache directory
    await moveChartToCacheDir(chartDir, dest);

    // Write index file
    await writeFile(indexPath, chartHash);

    return dest;
  } finally {
    await tmpDir.cleanup();
  }
}

async function writeValues(values: unknown) {
  const file = await tmp.file();

  await writeFile(file.path, stringify(values));

  return file;
}

async function renderChart(options: ChartOptions) {
  const args: string[] = [
    "template",
    ...(options.name ? [options.name] : []),
    ...getPullArgs(options),
    ...stringArrayArg("api-versions", options.apiVersions),
    ...booleanArg("dependency-update", options.dependencyUpdate),
    ...stringArg("description", options.description),
    ...booleanArg("generate-name", options.generateName),
    ...booleanArg("include-crds", options.includeCrds),
    ...booleanArg("is-upgrade", options.isUpgrade),
    ...stringArg("kube-version", options.kubeVersion),
    ...stringArg("name-template", options.nameTemplate),
    ...stringArg("namespace", options.namespace),
    ...booleanArg("no-hooks", options.noHooks),
    ...stringArg("post-renderer", options.postRenderer),
    ...stringArrayArg("post-renderer-args", options.postRendererArgs),
    ...booleanArg("skip-tests", options.skipTests),
    ...stringArg("timeout", options.timeout)
  ];
  let valueFile: tmp.FileResult | undefined;

  if (options.values) {
    valueFile = await writeValues(options.values);
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
    const cachedChart = await pullChart(opts);
    const { stdout } = await renderChart({
      ...opts,
      ...(cachedChart && { chart: cachedChart, repo: undefined })
    });

    return loadString(stdout, { transform });
  };
}
