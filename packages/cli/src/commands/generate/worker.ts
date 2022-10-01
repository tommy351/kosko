import { Config, EnvironmentConfig } from "@kosko/config";
import { spawn } from "@kosko/exec-utils";
import {
  generateAsync,
  Manifest,
  printAsync,
  PrintFormat
} from "@kosko/generate";
import { join } from "path";
import { CLIError } from "../../cli/error";
import { setupEnv } from "./env";
import { localRequireDefault } from "./require";
import { BaseGenerateArguments } from "./types";

async function* prependAsyncIterable<T>(
  iterable: AsyncIterable<T>,
  value: T
): AsyncIterable<T> {
  yield value;
  yield* iterable;
}

export interface GenerateOptions {
  printFormat?: PrintFormat;
  args: BaseGenerateArguments;
  config: Config & Required<EnvironmentConfig>;
  ignoreLoaders?: boolean;
}

export async function handler(options: GenerateOptions) {
  const { printFormat, args, config, ignoreLoaders } = options;

  if (!ignoreLoaders && config.loaders.length) {
    await runWithLoaders(options);
    return;
  }

  // Setup env
  await setupEnv(config, args);

  // Require external modules
  for (const id of config.require) {
    await localRequireDefault(id, args.cwd);
  }

  // Generate manifests
  const manifests = generateAsync({
    path: join(args.cwd, "components"),
    components: config.components,
    extensions: config.extensions,
    validate: args.validate
  });
  let first: Manifest | undefined;

  // Check if manifests is empty or not
  for await (const manifest of manifests) {
    first = manifest;
    break;
  }

  if (!first) {
    throw new CLIError("No manifests are exported from components", {
      output: `No manifests are exported from components. Make sure there are exported manifests in components.`
    });
  }

  if (printFormat) {
    printAsync(prependAsyncIterable(manifests, first), {
      format: printFormat,
      writer: process.stdout
    });
  }
}

async function runWithLoaders(options: GenerateOptions) {
  await spawn(
    process.execPath,
    [
      // Node.js-specific CLI options
      ...process.execArgv,
      // ESM loaders
      ...options.config.loaders.flatMap((loader) => ["--loader", loader]),
      // Entry file
      join(
        process.env.KOSKO_CLI_BIN || process.argv[1],
        "../../dist/commands/generate/worker-bin.js"
      )
    ],
    {
      stdio: ["pipe", "inherit", "inherit"],
      input: JSON.stringify(options)
    }
  );
}
