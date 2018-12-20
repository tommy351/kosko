import { CommandModule, Argv, Arguments } from "yargs";
import { join } from "path";
import { readDir, stat } from "./utils/fs";
import { logger } from "./utils/log";
import yaml from "js-yaml";

interface GenerateArguments extends Arguments {
  env: string;
  output: string;
  components: string[];
  require: string[];
}

export const generateCommand: CommandModule = {
  command: "generate [components..]",
  describe: "Generate Kubernetes resources from components and environments.",
  builder(argv: Argv) {
    return argv
      .option("env", {
        alias: "e",
        describe: "Choose the environment to apply.",
        required: true,
        type: "string"
      })
      .option("output", {
        alias: "o",
        describe: "Set output format",
        choices: ["yaml", "json"],
        default: "yaml"
      })
      .option("require", {
        alias: "r",
        describe: "Require modules",
        type: "array",
        default: []
      })
      .positional("components", {
        describe:
          "Specify components to output, otherwise all components will be generated.",
        type: "string"
      });
  },
  async handler(args: GenerateArguments) {
    const rootDir = process.cwd();
    const componentDir = join(rootDir, "components");
    const envDir = join(rootDir, "environments");
    let components = args.components;

    if (!components.length) {
      if (!(await checkDirectory(componentDir))) {
        logger.error(
          `"components" folder does not exist or is not a directory`,
          componentDir
        );
        return;
      }

      components = await readDir(componentDir);
    }

    global.kosko = {
      env: require(join(envDir, args.env))
    };

    for (const id of args.require) {
      require(id);
    }

    const list = components
      .map(c => require(join(componentDir, c)))
      .map(data => data.default || data)
      .reduce((acc, data) => acc.concat(data), [])
      .map((data: any) =>
        typeof data.toJSON === "function" ? data.toJSON() : data
      );

    const { stdout } = process;

    switch (args.output) {
      case "yaml":
        for (const item of list) {
          stdout.write("---\n" + yaml.safeDump(item));
        }
        break;

      case "json":
        stdout.write(JSON.stringify(list, null, "  "));
        break;
    }
  }
};

async function checkDirectory(path: string) {
  try {
    const stats = await stat(path);
    return stats.isDirectory();
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
    return false;
  }
}
