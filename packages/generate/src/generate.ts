import glob from "fast-glob";
import { join } from "path";
import Debug from "debug";
import { Result } from "./base";
import requireExtensions from "./requireExtensions";

const debug = Debug("kosko:generate");

export interface GenerateOptions {
  path: string;
  components: string[];
}

export async function generate(options: GenerateOptions): Promise<Result> {
  const extensions = Object.keys(requireExtensions)
    .map(ext => ext.substring(1))
    .join(",");
  const suffix = `?(.{${extensions}})`;
  const patterns = options.components.map(x => x + suffix);
  debug("glob patterns", patterns);

  const components = await glob<string>(patterns, {
    cwd: options.path,
    onlyFiles: false
  });
  debug("found components", components);

  const result: Result = {
    resources: []
  };

  for (const id of components) {
    const path = join(options.path, id);
    const mod = [].concat(await getComponentValue(path));

    for (const data of mod) {
      result.resources.push({
        path: require.resolve(path),
        data
      });
    }
  }

  return result;
}

function requireDefault(id: string) {
  const mod = require(id);
  return mod.__esModule ? mod.default : mod;
}

async function getComponentValue(id: string) {
  const mod = requireDefault(id);

  if (typeof mod === "function") {
    return await mod();
  }

  return mod;
}
