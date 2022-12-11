#!/usr/bin/env node
// @ts-check

import { readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { rollup } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import swc from "rollup-plugin-swc";
import typescript from "@rollup/plugin-typescript";
import ts from "typescript";
import moduleSuffixes from "../plugins/module-suffixes.js";
import replaceDenoImport from "../plugins/replace-deno-import.js";

const cwd = process.cwd();
const distDir = "dist";
const fullDistPath = join(cwd, distDir);
const pkgJson = JSON.parse(await readFile(join(cwd, "package.json"), "utf-8"));
const tsConfigPath = ts.findConfigFile(cwd, ts.sys.fileExists);
const dependencies = pkgJson.dependencies ?? {};

const args = process.argv.slice(2);
const entryFiles = args.length ? args : ["src/index.ts"];

/**
 * @param {{
 *   suffixes?: readonly string[];
 *   output: string;
 *   format: import("rollup").ModuleFormat;
 *   importMetaUrlShim?: boolean;
 *   target: 'browser' | 'node' | 'deno';
 *   dts?: boolean;
 *   replaceDenoImport?: boolean;
 * }} options
 */
async function buildBundle(options) {
  const bundle = await rollup({
    input: entryFiles,
    ...(!options.replaceDenoImport && {
      external: Object.keys(dependencies)
    }),
    treeshake: {
      preset: "recommended",
      // Assume all modules has no side effects in order to remove all unused
      // imports.
      moduleSideEffects: false
    },
    plugins: [
      ...(options.replaceDenoImport ? [replaceDenoImport(dependencies)] : []),
      ...(options.suffixes ? [moduleSuffixes(options.suffixes)] : []),
      nodeResolve({ extensions: [".ts"] }),
      replace({
        preventAssignment: true,
        values: {
          "process.env.BUILD_PROD": "true",
          "process.env.BUILD_TARGET": JSON.stringify(options.target),
          "process.env.BUILD_FORMAT": JSON.stringify(options.format),
          "process.env.TARGET_SUFFIX": JSON.stringify(options.output),
          ...(options.importMetaUrlShim && {
            "import.meta.url": "new URL(`file:${__filename}`).href"
          })
        }
      }),
      swc.default({
        jsc: {
          // Node.js 14
          target: "es2020",
          parser: { syntax: "typescript" },
          minify: {
            compress: true
          }
        },
        sourceMaps: true
      }),
      ...(options.dts
        ? [
            // TypeScript is only used for building declaration files only.
            typescript({
              tsconfig: tsConfigPath,
              compilerOptions: {
                outDir: distDir,
                declaration: true,
                emitDeclarationOnly: true
              },
              exclude: ["**/__tests__/**", "**/__fixtures__/**"]
            })
          ]
        : [])
    ]
  });

  try {
    await bundle.write({
      sourcemap: true,
      dir: distDir,
      entryFileNames: `[name].${options.output}`,
      chunkFileNames: `[name]-[hash].${options.output}`,
      format: options.format,
      interop: "auto"
    });
  } finally {
    await bundle.close();
  }
}

await rm(fullDistPath, { recursive: true, force: true });
await Promise.all([
  // Base
  buildBundle({
    output: "base.mjs",
    format: "esm",
    suffixes: [".esm"],
    target: "browser",
    dts: true
  }),

  // Node.js
  buildBundle({
    output: "node.cjs",
    format: "cjs",
    suffixes: [".node.cjs", ".node", ".cjs"],
    importMetaUrlShim: true,
    target: "node"
  }),
  buildBundle({
    output: "node.mjs",
    format: "esm",
    suffixes: [".node.esm", ".node", ".esm"],
    target: "node"
  }),

  // Deno
  buildBundle({
    output: "deno.mjs",
    format: "esm",
    suffixes: [".deno", ".esm"],
    target: "deno",
    replaceDenoImport: true
  })
]);
