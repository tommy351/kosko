import {
  Config,
  EnvironmentConfig,
  getConfig,
  searchConfig
} from "@kosko/config";
import { Environment } from "@kosko/env";
import { generate, print, PrintFormat } from "@kosko/generate";
import { requireDefault, resolve } from "@kosko/require";
import { join } from "path";
import { Command, RootArguments } from "../cli/command";
import Debug from "../cli/debug";
import { CLIError } from "../cli/error";

const debug = Debug.extend("generate");

async function localRequire(id: string, cwd: string) {
  debug("Finding module %s in %s", id, cwd);
  const path = await resolve(id, { basedir: cwd });
  debug("Importing %s from %s", id, path);
  return requireDefault(path);
}

async function importEnv(cwd: string): Promise<Environment> {
  return localRequire("@kosko/env", cwd);
}

function resolveConfig(
  base: Config,
  args: GenerateArguments
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

export interface GenerateArguments extends RootArguments {
  env?: string;
  output: PrintFormat;
  require?: string[];
  components?: string[];
}

export const generateCmd: Command<GenerateArguments> = {
  command: "generate [components..]",
  describe: "Generate Kubernetes manifests",
  builder(argv) {
    return argv
      .option("env", {
        type: "string",
        describe: "Name of environment",
        alias: "e"
      })
      .option("output", {
        type: "string",
        describe: "Output format",
        default: PrintFormat.YAML,
        choices: Object.keys(PrintFormat).map(key => PrintFormat[key as any]),
        alias: "o"
      })
      .option("require", {
        type: "array",
        describe:
          "Require modules. Modules set in config file will also be required.",
        default: [],
        alias: "r"
      })
      .positional("components", {
        describe:
          "Components to generate. This overrides components set in config file."
      })
      .example("$0 generate", "Generate components")
      .example("$0 generate foo bar", "Specify components")
      .example("$0 generate foo_*", "Use glob syntax")
      .example("$0 generate --env foo", "Set environment")
      .example("$0 generate -r ts-node/register", "Require external modules");
  },
  async handler(args) {
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

    // Set env
    if (args.env) {
      const env = await importEnv(args.cwd);

      env.cwd = args.cwd;
      env.env = args.env;

      if (config.paths && config.paths.environment) {
        const paths = config.paths.environment;
        if (paths.global) env.paths.global = paths.global;
        if (paths.component) env.paths.component = paths.component;
      }

      debug("Set env as", args.env);
    }

    // Require external modules
    for (const id of config.require) {
      await localRequire(id, args.cwd);
    }

    // Generate manifests
    const result = await generate({
      path: join(args.cwd, "components"),
      components: config.components,
      extensions: config.extensions
    });

    if (!result.manifests.length) {
      throw new CLIError("No manifests are exported from components", {
        output: `No manifests are exported from components. Make sure there are exported manifests in components.`
      });
    }

    print(result, {
      format: args.output,
      writer: process.stdout
    });
  }
};
