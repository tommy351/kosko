import type { Plugin } from "rollup";
import {
  basename,
  dirname,
  extname,
  isAbsolute,
  isRelative,
  relative
} from "../../../utils/path";

const SYSTEM_DIR = "/.kosko";
const SYSTEM_ENTRY_ID = `${SYSTEM_DIR}/entry.js`;
const SYSTEM_ENV_ID = `${SYSTEM_DIR}/env.js`;
const KOSKO_ENV_BARE_SPECIFIER = "@kosko/env";

interface BundleOptions {
  rollup: typeof import("rollup");
  files: Record<string, string>;
  component: string;
  environment: string;
  callbackId: string;
}

function isURL(url: string): boolean {
  return url.includes(":");
}

function getModuleURLForCDN(module: string) {
  return `https://cdn.skypack.dev/${module}`;
}

function generateEntry({
  component,
  callbackId
}: Pick<BundleOptions, "component" | "callbackId">): string {
  return `
import "${SYSTEM_ENV_ID}";
import { resolve, print, PrintFormat } from "@kosko/generate";
import component from "/components/${component}.js";

(async () => {
  const manifests = await resolve(component);
  const result = [];

  print({ manifests }, {
    format: PrintFormat.YAML,
    writer: {
      write(data) {
        result.push(data);
      }
    }
  });

  if (typeof window[${JSON.stringify(callbackId)}] === "function") {
    window[${JSON.stringify(callbackId)}](result.join(""));
  }
})();
`;
}

function generateEnvModule({
  files,
  environment
}: Pick<BundleOptions, "files" | "environment">): string {
  const koskoEnv = getModuleURLForCDN(KOSKO_ENV_BARE_SPECIFIER);
  const envs = Object.keys(files)
    .filter(
      (path) =>
        path.startsWith(`/environments/${environment}/`) &&
        extname(path) === ".js"
    )
    .map((path) => [basename(path, extname(path)), path] as const);

  return `
import { createSyncEnvironment, createSyncLoaderReducers } from "${koskoEnv}";
${envs.map(([, path], i) => `import env${i} from "${path}";`).join("\n")}

const envMap = {
  ${envs.map(([name], i) => `"${name}": env${i}`).join(",\n")}
};
const env = createSyncEnvironment();

env.setReducers(reducers => reducers.concat(createSyncLoaderReducers({
  global: () => envMap.index || {},
  component: (name) => envMap[name] || {},
})));

export default env;
`;
}

function createVirtualFSPlugin(files: Record<string, string>): Plugin {
  return {
    name: "virtual-fs",
    resolveId(source, importer) {
      if (isAbsolute(source)) {
        return source;
      }

      if (isRelative(source)) {
        const path = "/" + relative(dirname(importer), source);
        return path;
      }
    },
    load(id) {
      if (files[id] != null) {
        return files[id];
      }
    }
  };
}

function createCDNResolvePlugin(): Plugin {
  return {
    name: "cdn-resolve",
    resolveId(source) {
      if (isRelative(source) || isAbsolute(source)) {
        return;
      }

      if (isURL(source)) {
        return false;
      }

      return {
        id: getModuleURLForCDN(source),
        external: true
      };
    }
  };
}

function createAliasResolvePlugin(aliases: Record<string, string>): Plugin {
  return {
    name: "alias-resolve",
    resolveId(source) {
      const alias = aliases[source];
      if (alias) return alias;
    }
  };
}

export default async function generateBundle({
  rollup,
  files,
  component,
  environment,
  callbackId
}: BundleOptions) {
  const build = await rollup.rollup({
    input: SYSTEM_ENTRY_ID,
    plugins: [
      createAliasResolvePlugin({
        [KOSKO_ENV_BARE_SPECIFIER]: SYSTEM_ENV_ID
      }),
      createVirtualFSPlugin({
        ...files,
        [SYSTEM_ENTRY_ID]: generateEntry({ component, callbackId }),
        [SYSTEM_ENV_ID]: generateEnvModule({ files, environment })
      }),
      createCDNResolvePlugin()
    ],
    onwarn(warning) {
      console.warn(warning);
    }
  });

  const result = await build.generate({});

  return result.output[0].code;
}
