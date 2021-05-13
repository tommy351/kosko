/**
 * @packageDocumentation
 * @module @kosko/system-utils
 */

import fs from "fs";
import p from "path";
import makeDir from "make-dir";
import fastGlob from "fast-glob";
import { Stats, NotFoundError, GlobEntry, GlobOptions } from "./types";

export { Stats, NotFoundError, GlobEntry, GlobOptions };

function handleError(err: any) {
  if (err.code === "ENOENT") {
    return new NotFoundError(err.message);
  }

  return err;
}

export function cwd(): string {
  return process.cwd();
}

export function readFile(path: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) return reject(handleError(err));
      resolve(data);
    });
  });
}

export async function writeFile(path: string, data: string): Promise<void> {
  await ensureDir(p.dirname(path));

  return new Promise<void>((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) return reject(handleError(err));
      resolve();
    });
  });
}

export async function ensureDir(path: string): Promise<void> {
  try {
    await makeDir(path);
  } catch (err) {
    throw handleError(err);
  }
}

export function pathExists(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    fs.access(path, (err) => {
      resolve(!err);
    });
  });
}

export function readDir(path: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) return reject(handleError(err));
      resolve(files);
    });
  });
}

export function stat(path: string): Promise<Stats> {
  return new Promise<Stats>((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) return reject(handleError(err));

      resolve({
        isFile: stats.isFile(),
        isDirectory: stats.isDirectory(),
        isSymbolicLink: stats.isSymbolicLink(),
        size: stats.size
      });
    });
  });
}

export function joinPath(...paths: string[]): string {
  return p.join(...paths);
}

export async function glob(
  source: string | string[],
  { cwd = process.cwd(), onlyFiles = true }: GlobOptions = {}
): Promise<GlobEntry[]> {
  const paths = await fastGlob(source, { cwd, onlyFiles });

  return paths.map((path) => ({
    relativePath: path,
    absolutePath: p.join(cwd, path)
  }));
}
