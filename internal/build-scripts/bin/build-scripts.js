#!/usr/bin/env node
// @ts-check

import {
  copyFile,
  mkdir,
  readFile,
  rm,
  unlink,
  writeFile
} from "node:fs/promises";
import { dirname, extname, join, normalize, relative } from "node:path";
import { rollup } from "rollup";
import nodeResolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import swc from "@rollup/plugin-swc";
import json from "@rollup/plugin-json";
import virtual from "@rollup/plugin-virtual";
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
 *   reuse?: string;
 * }} options
 */
async function buildBundle(options) {
  console.log("Building bundle:", options.output);

  const entries = Object.fromEntries(
    entryFiles.map((path) => {
      const ext = extname(path);

      return [
        path.substring(0, path.length - ext.length),
        join(fullSrcPath, path)
      ];
    })
  );
  const bundle = await rollup({
    input: entries,
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
      virtual({
        "@kosko/build-scripts": `
export const BUILD_PROD = true;
export const BUILD_TARGET = ${JSON.stringify(options.target)};
export const BUILD_FORMAT = ${JSON.stringify(options.format)};
export const TARGET_SUFFIX = ${JSON.stringify(options.output)};
`
      }),
      replace({
        preventAssignment: true,
        values: {
          ...(options.importMetaUrlShim && {
            "import.meta.url": "new URL(`file:${__filename}`).href"
          })
        }
      }),
      swc({
        swc: {
          jsc: {
            // Node.js 18
            target: "es2022",
            parser: { syntax: "typescript" },
            minify: {
              compress: true
            }
          },
          sourceMaps: true
        }
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

  if (options.reuse) {
    await reuseBundle({
      reuse: options.reuse,
      output: options.output,
      entries: Object.keys(entries)
    });
  }
}

/**
 * @param {{
 *   reuse: string;
 *   output: string;
 *   entries: readonly string[];
 * }} options
 */
async function reuseBundle(options) {
  for (const entry of options.entries) {
    const outputName = `${entry}.${options.output}`;
    const reuseName = `${entry}.${options.reuse}`;
    const outputPath = join(fullDistPath, outputName);
    const reusePath = join(fullDistPath, reuseName);
    const outputContent = await readFile(outputPath, "utf-8");
    const reuseContent = await readFile(reusePath, "utf-8");

    if (
      stripSourceMapLine(outputContent) !== stripSourceMapLine(reuseContent)
    ) {
      continue;
    }

    console.log(`Reusing: ${outputName} -> ${reuseName}`);

    let importPath = relative(dirname(outputPath), reusePath);

    if (!importPath.startsWith(".")) {
      importPath = `./${importPath}`;
    }

    // Replace file content
    await writeFile(outputPath, `export * from "${importPath}";`);

    // Remove source map file
    await unlink(`${outputPath}.map`);
  }
}

/**
 * @param {string} content
 */
function stripSourceMapLine(content) {
  return content
    .split("\n")
    .map((line) => !line.startsWith("//# sourceMappingURL="))
    .join("\n");
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

// Build base bundle first
await buildBundle({
  output: "base.mjs",
  format: "esm",
  suffixes: [".esm"],
  target: "browser"
});

// Build Node.js bundles
await Promise.all([
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
    target: "node",
    reuse: "base.mjs"
  })
]);

await execa(tsc, ["--outDir", distDir]);
await mkdir(fullOutPath, { recursive: true });
await runApiExtractor();
await copyEsmDts();
