import { LoadOptions, loadString, Manifest } from "@kosko/yaml";
import tmp from "tmp-promise";
import { writeFile } from "node:fs/promises";
import {
  spawn,
  booleanArg,
  stringArg,
  stringArrayArg
} from "@kosko/exec-utils";
import stringify from "fast-safe-stringify";
import { getErrorCode } from "@kosko/common-utils";

async function writeValues(values: unknown) {
  const file = await tmp.file();

  await writeFile(file.path, stringify(values));

  return file;
}

async function runHelm({
  chart,
  name,
  apiVersions,
  caFile,
  certFile,
  dependencyUpdate,
  description,
  devel,
  generateName,
  keyFile,
  keyring,
  nameTemplate,
  namespace,
  noHooks,
  password,
  repo,
  includeCrds,
  skipTests,
  timeout,
  username,
  values,
  verify,
  version
}: Omit<ChartOptions, "transform">) {
  const args: string[] = [
    "template",
    ...(name ? [name] : []),
    chart,
    ...stringArrayArg("api-versions", apiVersions),
    ...stringArg("ca-file", caFile),
    ...stringArg("cert-file", certFile),
    ...booleanArg("dependency-update", dependencyUpdate),
    ...stringArg("description", description),
    ...booleanArg("devel", devel),
    ...booleanArg("generate-name", generateName),
    ...stringArg("key-file", keyFile),
    ...stringArg("keyring", keyring),
    ...stringArg("name-template", nameTemplate),
    ...stringArg("namespace", namespace),
    ...booleanArg("no-hooks", noHooks),
    ...stringArg("password", password),
    ...stringArg("repo", repo),
    ...booleanArg("include-crds", includeCrds),
    ...booleanArg("skip-tests", skipTests),
    ...stringArg("timeout", timeout),
    ...stringArg("username", username),
    ...booleanArg("verify", verify),
    ...stringArg("version", version)
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
export interface ChartOptions extends LoadOptions {
  /**
   * The path of a local chart or the name of a remote chart.
   */
  chart: string;

  /**
   * Name of the release.
   */
  name?: string;

  /**
   * Kubernetes API versions used for `Capabilities.APIVersions`.
   */
  apiVersions?: string[];

  /**
   * Verify certificates of HTTPS-enabled servers using this CA bundle.
   */
  caFile?: string;

  /**
   * Identify HTTPS client using this SSL certificate file.
   */
  certFile?: string;

  /**
   * Run helm dependency update before installing the chart.
   */
  dependencyUpdate?: boolean;

  /**
   * Add a custom description.
   */
  description?: string;

  /**
   * Use development versions, too. Equivalent to version '\>0.0.0-0'. If
   * `version` is set, this is ignored.
   */
  devel?: boolean;

  /**
   * Generate the name (and omit the `name` parameter).
   */
  generateName?: boolean;

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
   * Chart repository password where to locate the requested chart.
   */
  password?: string;

  /**
   * Chart repository url where to locate the requested chart.
   */
  repo?: string;

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
   * Chart repository username where to locate the requested chart.
   */
  username?: string;

  /**
   * Specify values.
   */
  values?: unknown;

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
export function loadChart(options: ChartOptions): () => Promise<Manifest[]> {
  const { transform, ...opts } = options;

  return async () => {
    const { stdout } = await runHelm(opts);

    // Find the first `---` in order to skip deprecation warnings
    const index = stdout.indexOf("---\n");

    return loadString(stdout.substring(index), { transform });
  };
}
