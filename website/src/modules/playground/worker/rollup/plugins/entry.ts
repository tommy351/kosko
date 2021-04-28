import type { Plugin } from "rollup";
import { BundleOptions } from "../../types";
import { COMPONENT_DIR, ENVIRONMENT_DIR, JS_EXT } from "../../../constants";
import { getModuleURLForCDN } from "../utils";
import { sep } from "@site/src/utils/path";

const PREFIX = "kosko:";
const ENTRY_ID = `${PREFIX}/entry.js`;
const ENV_ID = `${PREFIX}/env.js`;
const KOSKO_ENV = "@kosko/env";

function generateEntry({
  component,
  callback
}: Pick<BundleOptions, "component" | "callback">): string {
  const componentPath = `${COMPONENT_DIR}${component}${JS_EXT}`;

  return `
import "${ENV_ID}";
import { resolve, print, PrintFormat } from "@kosko/generate";
import component from "${componentPath}";

(async () => {
  try {
    const manifests = await resolve(component, {
      path: "${componentPath}"
    });

    const result = [];

    print({ manifests }, {
      format: PrintFormat.YAML,
      writer: {
        write(data) {
          result.push(data);
        }
      }
    });

    ${callback}({
      type: "success",
      payload: result.join("")
    });
  } catch (err) {
    ${callback}({
      type: "error",
      payload: {
        name: err.name,
        message: err.message,
        stack: err.stack
      }
    });
  }
})();
`;
}

function generateEnv({
  files,
  environment
}: Pick<BundleOptions, "files" | "environment">): string {
  const koskoEnv = getModuleURLForCDN(KOSKO_ENV);
  const envs: Record<string, string> = {};

  for (const path of Object.keys(files)) {
    if (!path.startsWith(ENVIRONMENT_DIR)) continue;

    const [env, name] = path.substring(ENVIRONMENT_DIR.length).split(sep);
    if (env !== environment) continue;
    if (!name || !name.endsWith(JS_EXT)) continue;

    envs[name.substring(0, name.length - JS_EXT.length)] = path;
  }

  return `
import { createSyncEnvironment, createSyncLoaderReducers } from "${koskoEnv}";
${Object.entries(envs)
  .map(([, path], i) => `import env${i} from "${path}";`)
  .join("\n")}

const envMap = {
  ${Object.entries(envs)
    .map(([name], i) => `"${name}": env${i}`)
    .join(",\n")}
};
const env = createSyncEnvironment();

env.setReducers(reducers => reducers.concat(createSyncLoaderReducers({
  global: () => envMap.index || {},
  component: (name) => envMap[name] || {},
})));

export default env;
`;
}

export default function entry(options: BundleOptions): Plugin {
  return {
    name: "entry",
    options(options) {
      return {
        ...options,
        input: ENTRY_ID
      };
    },
    resolveId(source) {
      if (source.startsWith(PREFIX)) {
        return source;
      }

      if (source === KOSKO_ENV) {
        return ENV_ID;
      }
    },
    load(source) {
      switch (source) {
        case ENTRY_ID:
          return generateEntry(options);
        case ENV_ID:
          return generateEnv(options);
      }
    }
  };
}
