import yaml from "js-yaml";
import { join } from "path";
import { Argv, CommandModule } from "yargs";
import { readDir } from "../utils/fs";
import { GlobalArguments, newContext } from "./base";
import { COMPONENT_DIR, Context } from "../context";
import { requireDefault } from "../utils/require";
import { Writable } from "stream";

interface GenerateArguments extends GlobalArguments {
  env: string;
  components: string[];
  require: string[];
  output: string;
}

export async function generateHandler(
  { cwd, logger }: Context,
  args: GenerateArguments
) {
  const componentDir = join(cwd, COMPONENT_DIR);
  const components = args.components || (await loadComponentList(componentDir));

  global.kosko = {
    env: args.env
  };

  logger.debug("Set global environment to", args.env);

  for (const id of args.require) {
    logger.debug("Require external modules", id);
    require(id);
  }

  let list = [];

  for (const id of components) {
    const path = join(componentDir, id);

    logger.debug("Load the component", path);

    const mod = requireDefault(path);

    if (typeof mod === "function") {
      list.push(await mod());
    } else {
      list.push(mod);
    }
  }

  list = flatten(list);

  const writer = process.stdout;

  switch (args.output) {
    case "yaml":
      printYAML(writer, list);
      break;

    case "json":
      printJSON(writer, list);
      break;
  }
}

async function loadComponentList(path: string) {
  return await readDir(path);
}

function flatten(arr: any[]) {
  return arr.reduce((acc, item) => acc.concat(item), []);
}

function printYAML(writer: Writable, data: any[]) {
  for (const item of data) {
    writer.write("---\n" + yaml.safeDump(item));
  }
}

function printJSON(writer: Writable, data: any[]) {
  const json = {
    apiVersion: "v1",
    kind: "List",
    items: data
  };

  writer.write(JSON.stringify(json, null, "  "));
}

export const generateCommand: CommandModule = {
  command: "generate [components..]",
  describe: "Generate Kubernetes resources",
  builder(argv: Argv) {
    return argv
      .option("env", {
        alias: "e",
        describe: "Specify the environment",
        required: true,
        type: "string"
      })
      .option("require", {
        alias: "r",
        describe: "Require modules",
        type: "array",
        default: []
      })
      .option("output", {
        alias: "o",
        describe: "Set output format",
        choices: ["yaml", "json"],
        default: "yaml"
      })
      .positional("components", {
        describe:
          "Specify components to output, otherwise all components will be generated",
        type: "string"
      });
  },
  async handler(args: GenerateArguments) {
    await generateHandler(newContext(args), args);
  }
};
