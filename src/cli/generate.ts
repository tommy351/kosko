import glob from "glob";
import yaml from "js-yaml";
import { join } from "path";
import { Writable } from "stream";
import { promisify } from "util";
import { Argv, CommandModule } from "yargs";
import { COMPONENT_DIR, Context } from "../context";
import { requireDefault } from "../utils/require";
import { GlobalArguments, newContext } from "./base";

const globAsync = promisify(glob);

interface GenerateArguments extends GlobalArguments {
  env: string;
  components: string[];
  require: string[];
  output: string;
}

type Printer = (writer: Writable, data: any) => void;

const printerMap: { [key: string]: Printer } = {
  yaml: printYAML,
  json: printJSON
};

export async function generateHandler(
  { cwd, logger }: Context,
  args: GenerateArguments
) {
  const componentDir = join(cwd, COMPONENT_DIR);
  const components = await listComponents(componentDir, args.components);

  if (!components.length) {
    return logger.error("No components");
  }

  global.kosko = {
    env: args.env
  };

  logger.debug("Set global environment to", args.env);

  for (const id of args.require) {
    logger.debug("Require external modules", id);
    require(id);
  }

  const list = [];

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

  printerMap[args.output](process.stdout, flatten(list));
}

function flatten(arr: any[]) {
  return arr.reduce((acc, item) => acc.concat(item), []);
}

async function listComponents(base: string, patterns: string[]) {
  const paths = await Promise.all(
    patterns.map(pattern => globAsync(pattern, { cwd: base }))
  );

  return flatten(paths);
}

function printYAML(writer: Writable, data: any) {
  const options = { noRefs: true };

  if (Array.isArray(data)) {
    for (const item of data) {
      writer.write("---\n" + yaml.safeDump(item, options));
    }
  } else {
    writer.write(yaml.safeDump(data, options));
  }
}

function printJSON(writer: Writable, data: any) {
  let json = data;

  if (Array.isArray(data)) {
    json = {
      apiVersion: "v1",
      kind: "List",
      items: data
    };
  }

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
        type: "string",
        default: "*"
      });
  },
  async handler(args: GenerateArguments) {
    await generateHandler(newContext(args), args);
  }
};
