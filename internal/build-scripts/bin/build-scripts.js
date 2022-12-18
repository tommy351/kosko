#!/usr/bin/env node
// @ts-check

import { readFile, rm, unlink } from "node:fs/promises";
import { join, normalize } from "node:path";
import { rollup } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import swc from "rollup-plugin-swc";
import json from "@rollup/plugin-json";
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";
import globby from "globby";
import execa from "execa";
import moduleSuffixes from "../plugins/module-suffixes.js";
import replaceDenoImport from "../plugins/replace-deno-import.js";
import { env } from "node:process";
import resolveBin from "resolve-bin";
import { promisify } from "node:util";

const resolveBinPromise = promisify(resolveBin);

const cwd = process.cwd();
const distDir = "dist";
const fullDistPath = join(cwd, distDir);
const tsc = await resolveBinPromise("typescript", { executable: "tsc" });
const pkgJson = JSON.parse(await readFile(join(cwd, "package.json"), "utf-8"));
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
 *   replaceDenoImport?: boolean;
 * }} options
 */
async function buildBundle(options) {
  console.log("Building bundle:", options.output);

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
      json({ compact: true, preferConst: true }),
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
      interop: "auto"
    });
  } finally {
    await bundle.close();
  }
}

async function runApiExtractor() {
  console.log("Running API extractor");

  const prepareOptions = ExtractorConfig.tryLoadForFolder({
    startingFolder: cwd
  });

  if (!prepareOptions) {
    console.log("API extractor config not found");
    return;
  }

  const config = ExtractorConfig.prepare(prepareOptions);
  const result = Extractor.invoke(config, {});

  if (!result.succeeded) {
    throw new Error("API extractor failed");
  }

  if (!config.rollupEnabled) {
    return;
  }

  console.log("Removing rolled-up type declaration files");

  const dtsFiles = await globby("**/*.d.ts", {
    cwd: join(cwd, "dist"),
    absolute: true
  });
  const dtsFilesToKeep = new Set(
    [
      config.alphaTrimmedFilePath,
      config.betaTrimmedFilePath,
      config.publicTrimmedFilePath,
      config.untrimmedFilePath
    ]
      .filter(Boolean)
      .map(normalize)
  );

  for (const file of dtsFiles) {
    const normalizedPath = normalize(file);

    if (!dtsFilesToKeep.has(normalizedPath)) {
      console.log("Deleting:", normalizedPath);
      await unlink(normalizedPath);
    }
  }
}

await rm(fullDistPath, { recursive: true, force: true });
await Promise.all([
  // Base
  buildBundle({
    output: "base.mjs",
    format: "esm",
    suffixes: [".esm"],
    target: "browser"
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
    replaceDenoImport: env.DENO_BUILD_PROD !== "1"
  })
]);

await execa(tsc, ["--outDir", distDir]);
await rm(join(cwd, "out"), { recursive: true, force: true });
await runApiExtractor();
