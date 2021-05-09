import fs from "fs-extra";
import globby from "globby";
import { dirname, join } from "path";
import {
  TransformOptions,
  parseAsync,
  transformFromAstAsync
} from "@babel/core";
import assert from "assert";

async function readTsConfig(path: string): Promise<any> {
  return fs.readJson(path);
}

async function transformFile(path: string): Promise<string> {
  const options: TransformOptions = {
    filename: path,
    plugins: [
      require.resolve("@babel/plugin-syntax-typescript"),
      require.resolve("@kosko/babel-plugin-deno-import")
    ]
  };
  const code = await fs.readFile(path, "utf8");
  const ast = await parseAsync(code, options);
  assert(ast);

  const result = await transformFromAstAsync(ast, code, options);
  assert(result);
  assert(result.code);

  return result.code;
}

export async function build(tsConfigPath: string): Promise<void> {
  const tsConfig = await readTsConfig(tsConfigPath);
  const pkgDir = dirname(tsConfigPath);
  const srcDir = join(pkgDir, tsConfig.compilerOptions.rootDir);
  const distDir = join(pkgDir, "deno_dist");

  console.log("Building package: %s", pkgDir);

  const srcFiles = await globby("**/*.ts", {
    cwd: srcDir,
    ignore: ["**/__tests__/**", "**/__fixtures__/**", "**/__mocks__/**"]
  });

  for (const path of srcFiles) {
    console.log("- %s", path);

    const src = join(srcDir, path);
    const dest = join(distDir, path);

    await fs.outputFile(dest, await transformFile(src));
  }
}
