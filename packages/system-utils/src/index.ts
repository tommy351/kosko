/**
 * @packageDocumentation
 * @module @kosko/system-utils
 */

import fs from "fs";
import path from "path";
import makeDir from "make-dir";
import { Stats, NotFoundError } from "./types";

export { Stats, NotFoundError };

function handleError(err: any) {
  if (err.code === "ENOENT") {
    return new NotFoundError(err.message);
  }

  return err;
}

export function cwd(): string {
  return process.cwd();
}

export function readFile(src: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(src, "utf8", (err, data) => {
      if (err) return reject(handleError(err));
      resolve(data);
    });
  });
}

export async function writeFile(dest: string, data: string): Promise<void> {
  await ensureDir(path.dirname(dest));

  return new Promise<void>((resolve, reject) => {
    fs.writeFile(dest, data, (err) => {
      if (err) return reject(handleError(err));
      resolve();
    });
  });
}

export async function ensureDir(dest: string): Promise<void> {
  try {
    await makeDir(dest);
  } catch (err) {
    throw handleError(err);
  }
}

export function pathExists(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    fs.access(src, (err) => {
      resolve(!err);
    });
  });
}

export function readDir(src: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(src, (err, files) => {
      if (err) return reject(handleError(err));
      resolve(files);
    });
  });
}

export function stat(src: string): Promise<Stats> {
  return new Promise<Stats>((resolve, reject) => {
    fs.stat(src, (err, stats) => {
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
  return path.join(...paths);
}
