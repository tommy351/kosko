import { Environment } from "@kosko/env";
import { generate, print, PrintFormat } from "@kosko/generate";
import { requireDefault, resolve } from "@kosko/require";
import Debug from "debug";
import { join } from "path";
import { Command, RootArguments } from "../cli/command";

const debug = Debug("kosko:generate");

async function importEnv(cwd: string): Promise<Environment> {
  const path = await resolve("@kosko/env", { basedir: cwd });
  debug("Importing @kosko/env from", path);
  return requireDefault(path);
}

export interface GenerateArguments extends RootArguments {
  env: string;
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
        required: true,
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
      });
  },
  async handler(args) {
    // Require external modules
    if (args.require) {
      for (const id of args.require) {
        debug("Require external module", id);
        require(id);
      }
    }

    // Set env
    const env = await importEnv(args.cwd);
    env.env = args.env;
    debug("Set env as", args.env);

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
