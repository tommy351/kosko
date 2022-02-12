import {
  Config,
  EnvironmentConfig,
  getConfig,
  searchConfig
} from "@kosko/config";
import { generate, print, PrintFormat, Result } from "@kosko/generate";
import { join } from "path";
import { Argv } from "yargs";
import { Command, RootArguments } from "../../cli/command";
import { CLIError } from "../../cli/error";
import { SetOption, parseSetOptions } from "./set-option";
import { localRequireDefault } from "./require";
import { BaseGenerateArguments, GenerateArguments } from "./types";
import { setupEnv } from "./env";

export type { BaseGenerateArguments, GenerateArguments };

function resolveConfig(
  base: Config,
  args: BaseGenerateArguments
): Required<EnvironmentConfig> {
  const { components = [], require = [] } = args.env
    ? getConfig(base, args.env)
    : base;

  return {
    components:
      args.components && args.components.length ? args.components : components,
    require: [...require, ...(args.require || [])]
  };
}

/* istanbul ignore next */
export function generateBuilder(
  argv: Argv<RootArguments>
): Argv<BaseGenerateArguments> {
  return argv
    .option("env", {
      type: "string",
      describe: "Environment name",
      alias: "e"
    })
    .option("require", {
      type: "string",
      array: true,
      describe:
        "Require modules. Modules set in config file will also be required.",
      default: [],
      alias: "r"
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
}

export async function generateHandler(
  args: BaseGenerateArguments
): Promise<Result> {
  // Load config
  const globalConfig = await searchConfig(args.cwd);
  const config = {
    ...globalConfig,
    ...resolveConfig(globalConfig, args)
  };

  if (!config.components.length) {
    throw new CLIError("No components are given", {
      output:
        "No components are given. Set components in a config file or in arguments."
    });
  }

  // Setup env
  await setupEnv(config, args);

  // Require external modules
  for (const id of config.require) {
    await localRequireDefault(id, args.cwd);
  }

  // Generate manifests
  const result = await generate({
    path: join(args.cwd, "components"),
    components: config.components,
    extensions: config.extensions,
    validate: args.validate
  });

  if (!result.manifests.length) {
    throw new CLIError("No manifests are exported from components", {
      output: `No manifests are exported from components. Make sure there are exported manifests in components.`
    });
  }

  return result;
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
        choices: Object.keys(PrintFormat).map(
          (key) => (PrintFormat as any)[key]
        ),
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
      .example("$0 generate --env foo", "Set environment")
      .example("$0 generate -r ts-node/register", "Require external modules");
  },
  async handler(args) {
    const result = await generateHandler(args);

    print(result, {
      format: args.output,
      writer: process.stdout
    });
  }
};
