import type { Plugin } from "rollup";
import { init, parse } from "es-module-lexer";
import {
  basename,
  dirname,
  extname,
  isAbsolute,
  isRelative,
  relative
} from "../../../utils/path";

const SYSTEM_DIR = "/.kosko";
const ENTRY_ID = `${SYSTEM_DIR}/entry.js`;

function isURL(url: string): boolean {
  return url.includes(":");
}

function generateEntry({
  files,
  component,
  environment,
  callbackId
}: Omit<BundleOptions, "rollup">): string {
  return `
import env, { createAsyncLoaderReducers } from "@kosko/env";
import { resolve, print, PrintFormat } from "@kosko/generate";

env.setReducers(() => createAsyncLoaderReducers({
  global: () => import("/environments/${environment}/index.js").then(mod => mod.default),
  component: (name) => {
    switch (name) {
      ${Object.keys(files)
        .filter((path) => path.startsWith(`/environments/${environment}/`))
        .map((path) => {
          const name = basename(path, extname(path));
          return `case "${name}": return import("${path}").then(mod => mod.default);`;
        })
        .join("\n")}
    }
  }
}));

const manifests = await resolve(import("./components/${component}.js").then(mod => mod.default));
const result = [];

print({ manifests }, {
  format: PrintFormat.YAML,
  writer: {
    write(data) {
      result.push(data);
    }
  }
});

if (typeof window.${callbackId} === "function") {
  window.${callbackId}(result.join(""));
}
`;
}

function createResolveImportPlugin(files: Record<string, string>): Plugin {
  return {
    name: "resolve-import",
    resolveId(source, importer) {
      if (isAbsolute(source)) {
        return source;
      }

      if (isRelative(source)) {
        const path = "/" + relative(dirname(importer), source);
        return path;
      }

      if (isURL(source)) {
        return false;
      }

      return {
        id: `https://cdn.skypack.dev/${source}`,
        external: true
      };
    },
    load(id) {
      if (files[id] != null) {
        return files[id];
      }
    }
  };
}

function createWrapChunkPlugin(): Plugin {
  return {
    name: "wrap-chunk",
    renderChunk(code) {
      const [imports] = parse(code);
      if (!imports.length) return code;

      const lastImport = imports[imports.length - 1];
      const endOfImportStatement = lastImport.se;
      const importStatements = code.substring(0, endOfImportStatement);
      const wrapperContent = code.substring(endOfImportStatement + 1);

      return `${importStatements};(async () => {${wrapperContent}})();`;
    }
  };
}

interface BundleOptions {
  rollup: typeof import("rollup");
  files: Record<string, string>;
  component: string;
  environment: string;
  callbackId: string;
}

export default async function generateBundle({
  rollup,
  files,
  component,
  environment,
  callbackId
}: BundleOptions) {
  await init;

  const build = await rollup.rollup({
    input: ENTRY_ID,
    plugins: [
      createResolveImportPlugin({
        ...files,
        [ENTRY_ID]: generateEntry({ files, component, environment, callbackId })
      })
    ],
    onwarn(warning) {
      console.warn(warning);
    }
  });

  const result = await build.generate({
    inlineDynamicImports: true,
    plugins: [createWrapChunkPlugin()]
  });

  return result.output[0].code;
}
