#!/usr/bin/env node
// @ts-check

import { copyFile, mkdir, readFile, rm, unlink } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { rollup } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import swc from "rollup-plugin-swc";
import json from "@rollup/plugin-json";
import { Extractor, ExtractorConfig } from "@microsoft/api-extractor";
import globby from "globby";
import execa from "execa";
import moduleSuffixes from "../plugins/module-suffixes.js";
import resolveBin from "resolve-bin";
import { promisify } from "node:util";

const resolveBinPromise = promisify(resolveBin);

const cwd = process.cwd();

// srcDir stores source files.
const srcDir = "src";
const fullSrcPath = join(cwd, srcDir);

// distDir stores files that will be published.
const distDir = "dist";
const fullDistPath = join(cwd, distDir);

// outDir stores files for internal usage.
const outDir = "out";
const fullOutPath = join(cwd, outDir);

const tsc = await resolveBinPromise("typescript", { executable: "tsc" });
const pkgJson = JSON.parse(await readFile(join(cwd, "package.json"), "utf-8"));
const dependencies = pkgJson.dependencies ?? {};

const args = process.argv.slice(2);
const entryFiles = args.length ? args : ["index.ts"];

/**
 * @param {{
 *   suffixes?: readonly string[];
 *   output: string;
 *   format: import("rollup").ModuleFormat;
 *   importMetaUrlShim?: boolean;
 *   target: 'browser' | 'node';
 * }} options
 */
async function buildBundle(options) {
  console.log("Building bundle:", options.output);

  const bundle = await rollup({
    input: Object.fromEntries(
      entryFiles.map((path) => {
        const ext = extname(path);

        return [
          path.substring(0, path.length - ext.length),
          join(fullSrcPath, path)
        ];
      })
    ),
    external: [
      ...Object.keys(dependencies),
      ...Object.keys(pkgJson.peerDependencies ?? {})
    ],
    treeshake: {
      preset: "recommended",
      // Assume all modules has no side effects in order to remove all unused
      // imports.
      moduleSideEffects: false
    },
    plugins: [
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
          // Node.js 18
          target: "es2022",
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

async function copyEsmDts() {
  const paths = await globby("**/*.d.ts", {
    cwd: join(cwd, "dist"),
    absolute: true
  });

  for (const path of paths) {
    const dst = path.replace(/\.d\.ts$/, ".d.mts");
    console.log("Copying:", dst);
    await copyFile(path, dst);
  }
}

await rm(fullDistPath, { recursive: true, force: true });
await rm(fullOutPath, { recursive: true, force: true });

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
  })
]);

await execa(tsc, ["--outDir", distDir]);
await mkdir(fullOutPath, { recursive: true });
await runApiExtractor();
await copyEsmDts();
