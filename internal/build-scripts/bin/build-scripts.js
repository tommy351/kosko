#!/usr/bin/env node
// @ts-check

import { readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { rollup } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import swc from "rollup-plugin-swc";
import dts from "rollup-plugin-dts";
import ts from "typescript";
import moduleSuffixes from "../plugins/module-suffixes.js";
import { fileURLToPath } from "node:url";

const cwd = process.cwd();
const distDir = "dist";
const fullDistPath = join(cwd, distDir);
const pkgJson = JSON.parse(await readFile(join(cwd, "package.json"), "utf-8"));

const args = process.argv.slice(2);
const entryFiles = args.length ? args : ["src/index.ts"];

/**
 * @param {{
 *   suffixes?: readonly string[];
 *   output: string;
 *   format: import("rollup").ModuleFormat;
 *   importMetaUrlShim?: boolean;
 * }} options
 */
async function buildBundle(options) {
  const bundle = await rollup({
    input: entryFiles,
    external: Object.keys(pkgJson.dependencies ?? {}),
    plugins: [
      ...(options.suffixes ? [moduleSuffixes(options.suffixes)] : []),
      nodeResolve({ extensions: [".ts"] }),
      replace({
        preventAssignment: true,
        values: {
          "process.env.BUILD_PROD": "true",
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
          parser: { syntax: "typescript" }
        },
        sourceMaps: true
      })
    ]
  });

  try {
    await bundle.write({
      sourcemap: true,
      dir: distDir,
      entryFileNames: `[name].${options.output}`,
      chunkFileNames: `[name]-[hash].${options.output}`,
      format: options.format,
      exports: "auto"
    });
  } finally {
    await bundle.close();
  }
}

async function buildDts() {
  const config = ts.getParsedCommandLineOfConfigFile(
    join(fileURLToPath(import.meta.url), "../../../../tsconfig.json"),
    undefined,
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic(diagnostic) {
        ts.formatDiagnostic(diagnostic, {
          getCurrentDirectory: () => cwd,
          getCanonicalFileName: (fileName) => fileName,
          getNewLine: () => ts.sys.newLine
        });
      }
    }
  );
  const bundle = await rollup({
    input: entryFiles,
    external: Object.keys(pkgJson.dependencies ?? {}),
    plugins: [
      nodeResolve({ extensions: [".ts"] }),
      dts({
        compilerOptions: config?.options
      })
    ]
  });

  try {
    await bundle.write({
      dir: distDir,
      entryFileNames: `[name].d.ts`,
      format: "es"
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
    suffixes: [".esm"]
  }),

  // Node.js
  buildBundle({
    output: "node.cjs",
    format: "cjs",
    suffixes: [".node.cjs", ".node", ".cjs"],
    importMetaUrlShim: true
  }),
  buildBundle({
    output: "node.mjs",
    format: "esm",
    suffixes: [".node.esm", ".node", ".esm"]
  }),

  // Type declaration
  buildDts()
]);
