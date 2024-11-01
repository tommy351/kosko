import { Config, EnvironmentConfig } from "@kosko/config";
import { spawn, SpawnError } from "@kosko/exec-utils";
import { generate, print, PrintFormat, Result } from "@kosko/generate";
import { join } from "node:path";
import stringify from "fast-safe-stringify";
import { CLIError } from "@kosko/cli-utils";
import { setupEnv } from "./env";
import { handleGenerateError, printIssues, resultHasError } from "./error";
import { BaseGenerateArguments } from "./types";
import { fileURLToPath } from "node:url";
import { stdout, execPath, execArgv } from "node:process";
import { createRequire } from "node:module";
import { loadPlugins } from "./plugin";
import { BUILD_TARGET, TARGET_SUFFIX } from "@kosko/build-scripts";

export interface WorkerOptions {
  printFormat?: PrintFormat;
  args: BaseGenerateArguments;
  config: Config & Required<EnvironmentConfig>;
  ignoreLoaders?: boolean;
}

export async function handler(options: WorkerOptions) {
  const { printFormat, args, config, ignoreLoaders } = options;

  if (
    BUILD_TARGET === "node" &&
    !ignoreLoaders &&
    (config.loaders.length || config.import.length)
  ) {
    await runWithLoaders(options);
    return;
  }

  // Setup env
  await setupEnv(config, args);

  // Require external modules
  if (BUILD_TARGET === "node" && config.require.length) {
    const req = createRequire(join(args.cwd, "noop.js"));

    for (const id of config.require) {
      req(id);
    }
  }

  // Load plugins
  const plugin = await loadPlugins(args.cwd, config.plugins);

  // Generate manifests
  let result: Result;

  try {
    result = await generate({
      path: join(args.cwd, "components"),
      components: config.components,
      extensions: config.extensions,
      validate: args.validate,
      bail: config.bail,
      concurrency: config.concurrency,
      transform: plugin.transformManifest,
      validateManifest: plugin.validateManifest,
      ...(!args.components?.length && {
        validateAllManifests: plugin.validateAllManifests
      })
    });
  } catch (err) {
    handleGenerateError(err);
    return;
  }

  if (!result.manifests.length) {
    throw new CLIError("No manifests are exported from components", {
      output: `No manifests are exported from components. Make sure there are exported manifests in components.`
    });
  }

  if (printFormat && !resultHasError(result)) {
    print(result, {
      format: printFormat,
      writer: stdout
    });
  }

  printIssues(args.cwd, result);
}

async function runWithLoaders(options: WorkerOptions) {
  try {
    await spawn(
      execPath,
      [
        // Node.js-specific CLI options
        ...execArgv,
        // ESM loaders
        ...options.config.loaders.flatMap((loader) => ["--loader", loader]),
        // ESM import
        ...options.config.import.flatMap((imp) => ["--import", imp]),
        // Entry file
        join(fileURLToPath(import.meta.url), "../worker-bin." + TARGET_SUFFIX)
      ],
      {
        stdio: ["pipe", "inherit", "inherit"],
        input: stringify(options)
      }
    );
  } catch (err) {
    if (err instanceof SpawnError) {
      throw new CLIError(err.message, {
        // Omit the output because it should be directly printed to stderr by
        // `spawn` function.
        output: "",
        code: err.exitCode
      });
    }

    throw err;
  }
}
