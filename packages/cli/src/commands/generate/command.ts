import { PrintFormat } from "@kosko/generate";
import { Argv } from "yargs";
import { Command, RootArguments } from "../../cli/command";
import { loadConfig } from "./config";
import { SetOption, parseSetOptions } from "./set-option";
import { BaseGenerateArguments, GenerateArguments } from "./types";
import { handler } from "./worker";

/* istanbul ignore next */
export function generateBuilder(
  argv: Argv<RootArguments>
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

  // eslint-disable-next-line no-restricted-globals
  if (process.env.BUILD_TARGET === "node") {
    base = base
      .option("require", {
        type: "string",
        array: true,
        describe:
          "Require modules. Modules set in config file will also be required.",
        alias: "r"
      })
      .option("loader", {
        type: "string",
        array: true,
        describe:
          "Module loader. Loaders set in config file will also be loaded."
      });
  }

  return base;
}

export const generateCmd: Command<GenerateArguments> = {
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
