import { Config, EnvironmentConfig } from "@kosko/config";
import { spawn, SpawnError } from "@kosko/exec-utils";
import { generateAsync, getPrinter, PrintFormat } from "@kosko/generate";
import { join } from "node:path";
import stringify from "fast-safe-stringify";
import { CLIError } from "../../cli/error";
import { setupEnv } from "./env";
import { handleGenerateError } from "./error";
import { BaseGenerateArguments } from "./types";
import { fileURLToPath } from "node:url";
import { execPath, execArgv } from "node:process";
import { createRequire } from "node:module";
import { BufferWriter } from "./writer";
import { getStdout } from "./process";
import AggregateError from "@kosko/aggregate-error";

export interface WorkerOptions {
  printFormat?: PrintFormat;
  args: BaseGenerateArguments;
  config: Config & Required<EnvironmentConfig>;
  ignoreLoaders?: boolean;
}

export async function handler(options: WorkerOptions) {
  const { printFormat, args, config, ignoreLoaders } = options;

  if (
    // eslint-disable-next-line no-restricted-globals
    process.env.BUILD_TARGET === "node" &&
    !ignoreLoaders &&
    config.loaders.length
  ) {
    await runWithLoaders(options);
    return;
  }

  // Setup env
  await setupEnv(config, args);

  // Require external modules
  // eslint-disable-next-line no-restricted-globals
  if (process.env.BUILD_TARGET === "node" && config.require.length) {
    const req = createRequire(join(args.cwd, "noop.js"));

    for (const id of config.require) {
      req(id);
    }
  }

  const { printer, writer } = (() => {
    if (!printFormat) {
      return { printer: undefined, writer: undefined };
    }

    // Store the result in a buffer instead of printing to stdout directly
    // because we don't want to print anything if any error occurs.
    const writer = new BufferWriter();

    return {
      writer,
      printer: getPrinter({
        format: printFormat,
        writer
      })
    };
  })();
  const errors: unknown[] = [];
  let count = 0;

  // Generate manifests
  for await (const result of generateAsync({
    path: join(args.cwd, "components"),
    components: config.components,
    extensions: config.extensions,
    validate: args.validate
  })) {
    if (result.type === "error") {
      errors.push(result.error);
      if (args.bail) break;
    } else {
      count++;
      printer?.print(result.manifest.data);
    }
  }

  if (errors.length) {
    throw handleGenerateError(args.cwd, new AggregateError(errors), args);
  }

  if (!count) {
    throw new CLIError("No manifests are exported from components", {
      output: `No manifests are exported from components. Make sure there are exported manifests in components.`
    });
  }

  printer?.flush();
  writer?.pipe(getStdout());
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
        // Entry file
        join(
          fileURLToPath(import.meta.url),
          // eslint-disable-next-line no-restricted-globals
          "../worker-bin." + process.env.TARGET_SUFFIX
        )
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
