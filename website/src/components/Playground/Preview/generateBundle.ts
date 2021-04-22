import type rollupType from "rollup";
import { basename, extname } from "../../../utils/path";
import createVirtualFSPlugin from "./virtualFS";
import createCDNResolvePlugin, { getModuleURLForCDN } from "./cdnResolve";
import createAliasPlugin from "./alias";

const SYSTEM_DIR = "/.kosko";
const SYSTEM_ENTRY_ID = `${SYSTEM_DIR}/entry.js`;
const SYSTEM_ENV_ID = `${SYSTEM_DIR}/env.js`;
const KOSKO_ENV_BARE_SPECIFIER = "@kosko/env";

interface BundleOptions {
  files: Record<string, string>;
  component: string;
  environment: string;
  callbackId: string;
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

export default async function generateBundle({
  files,
  component,
  environment,
  callbackId
}: BundleOptions) {
  const rollup: typeof rollupType = await import(
    /* webpackChunkName: "rollup" */ "rollup/dist/rollup.browser"
  );

  const build = await rollup.rollup({
    input: SYSTEM_ENTRY_ID,
    plugins: [
      createAliasPlugin({
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
