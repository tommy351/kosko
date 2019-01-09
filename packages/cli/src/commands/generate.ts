import { Environment } from "@kosko/env";
import { generate, print, PrintFormat } from "@kosko/generate";
import { requireDefault, resolve } from "@kosko/require";
import Debug from "debug";
import { join } from "path";
import { Command, RootArguments } from "../cli/command";

const debug = Debug("kosko:cli:generate");

async function localRequire(id: string, cwd: string) {
  debug("Finding module %s in %s", id, cwd);
  const path = await resolve(id, { basedir: cwd });
  debug("Importing %s from %s", id, path);
  return requireDefault(path);
}

async function importEnv(cwd: string): Promise<Environment> {
  return localRequire("@kosko/env", cwd);
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
        describe: "Require modules",
        default: [],
        alias: "r"
      })
      .positional("components", {
        describe: "Components to generate",
        default: "*"
      })
      .example("$0 generate", "Generate all components")
      .example("$0 generate foo bar", "Specify components")
      .example("$0 generate foo_*", "Use glob syntax")
      .example("$0 generate --env foo", "Set environment")
      .example("$0 generate -r ts-node/register", "Require external modules");
  },
  async handler(args) {
    // Require external modules
    if (args.require) {
      for (const id of args.require) {
        await localRequire(id, args.cwd);
      }
    }

    // Set env
    if (args.env) {
      const env = await importEnv(args.cwd);
      env.cwd = args.cwd;
      env.env = args.env;
      debug("Set env as", args.env);
    }

    // Read components from raw parser output to support multiple arguments
    const components = args.components || [];

    // Generate manifests
    const result = await generate({
      path: join(args.cwd, "components"),
      components
    });

    print(result, {
      format: args.output,
      writer: process.stdout
    });
  }
};
