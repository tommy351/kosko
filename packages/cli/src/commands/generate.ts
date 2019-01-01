import { generate, print, PrintFormat } from "@kosko/generate";
import Debug from "debug";
import { join } from "path";
import { BaseOptions, baseOptions, getCWD } from "../base";
import { help } from "../cli/help";
import { parse, ParseError } from "../cli/parse";
import { Command, OptionType } from "../cli/types";

const debug = Debug("kosko:generate");

export interface GenerateOptions extends BaseOptions {
  env: string;
  output: PrintFormat;
  require: string[];
}

export const generateCmd: Command<GenerateOptions> = {
  usage: "kosko generate [components...]",
  description: "Generate Kubernetes resources.",
  options: {
    ...baseOptions,
    env: {
      type: OptionType.String,
      description: "Environment name.",
      alias: "e",
      required: true
    },
    output: {
      type: OptionType.String,
      description: "Output format.",
      alias: "o",
      options: Object.keys(PrintFormat).map(key => PrintFormat[key as any]),
      default: PrintFormat.YAML
    },
    require: {
      type: OptionType.Array,
      description: "Require modules.",
      alias: "r"
    }
  },
  args: [{ name: "components", description: "Components to generate." }],
  async exec(ctx, argv) {
    const { options, detail, errors } = parse<GenerateOptions, {}>(argv, this);
    const cwd = getCWD(options);

    if (options.help) {
      return help(this);
    }

    if (errors.length) {
      throw new ParseError(errors);
    }

    // Require external modules
    if (options.require) {
      for (const id of options.require) {
        debug("Require external module", id);
        require(id);
      }
    }

    // Set global env
    global.kosko = {
      env: options.env
    };
    debug("Set global env as", options.env);

    // Read components from raw parser output to support multiple arguments
    const components = detail.argv._;

    // Generate resources
    const result = await generate({
      path: join(cwd, "components"),
      components: components.length ? components : ["*"]
    });

    print(result, {
      format: options.output,
      writer: process.stdout
    });
  }
};
