import { PrintFormat } from "@kosko/generate";
import type { Argv, CommandModule } from "yargs";
import type { GlobalArguments } from "@kosko/cli-utils";
import { loadConfig } from "./config";
import { SetOption, parseSetOptions } from "./set-option";
import type { BaseGenerateArguments, GenerateArguments } from "./types";
import { handler } from "./worker";
import { BUILD_TARGET } from "@kosko/build-scripts";

/* istanbul ignore next */
export function generateBuilder(
  argv: Argv<GlobalArguments>
): Argv<BaseGenerateArguments> {
  let base = argv
    .option("env", {
      type: "string",
      describe: "Environment name",
      alias: "e"
    })
    .option("config", {
      type: "string",
      describe: "Config path. Default to `kosko.toml` in current folder.",
      alias: "c"
    })
    .option("bail", {
      type: "boolean",
      describe: "Stop immediately when an error occurred."
    })
    .option("set", {
      type: "string",
      array: true,
      describe:
        "Set values on the command line KEY=VAL (can be used multiple times)",
      alias: "s",
      coerce: parseSetOptions,
      default: [] as SetOption[]
    })
    .positional("components", {
      type: "string",
      array: true,
      describe:
        "Components to generate. This overrides components set in config file."
    });

  if (BUILD_TARGET === "node") {
    base = base
      .option("require", {
        type: "string",
        array: true,
        describe:
          "Require CommonJS modules. Modules set in config file are also required.",
        alias: "r"
      })
      .option("loader", {
        type: "string",
        array: true,
        describe: "Module loader. Loaders set in config file are also loaded."
      })
      .option("import", {
        type: "string",
        array: true,
        describe:
          "Preload ES modules at startup. Modules set in config file are also imported."
      });
  }

  return base;
}

export const generateCmd: CommandModule<GlobalArguments, GenerateArguments> = {
  command: "generate [components..]",
  describe: "Generate Kubernetes manifests",
  builder(argv) {
    /* istanbul ignore next */
    return generateBuilder(argv)
      .option("output", {
        type: "string",
        describe: "Output format",
        default: PrintFormat.YAML,
        choices: Object.values(PrintFormat),
        alias: "o"
      })
      .option("validate", {
        type: "boolean",
        describe: "Validate components",
        default: true
      })
      .example("$0 generate", "Generate manifests")
      .example("$0 generate foo bar", "Specify components")
      .example("$0 generate foo_*", "Use glob pattern")
      .example("$0 generate --env foo", "Set environment");
  },
  async handler(args) {
    const config = await loadConfig(args);

    await handler({
      printFormat: args.output,
      args,
      config
    });
  }
};
