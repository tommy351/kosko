import { CommandModule, Argv, Arguments } from "yargs";
import { join } from "path";
import { readDir, stat } from "../utils/fs";
import { logger } from "../utils/log";
import yaml from "js-yaml";

interface GenerateArguments extends Arguments {
  env: string;
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
      .map(data => {
        if (data.__esModule) data = data.default;
        if (typeof data === "function") return data();
        return data;
      })
      .reduce((acc, data) => acc.concat(data), []);

    for (const item of list) {
      process.stdout.write("---\n" + yaml.safeDump(item));
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
