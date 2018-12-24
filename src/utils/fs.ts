import fs from "fs";
import mkdirp from "mkdirp";
import { promisify } from "util";

export const access = promisify(fs.access);
export const readDir = promisify(fs.readdir);
export const stat = promisify(fs.stat);
export const readFile = promisify(fs.readFile);
export const writeFile = promisify(fs.writeFile);
export const mkdirs = promisify(mkdirp);

export async function exists(path: string, mode?: number) {
  try {
    await access(path, mode);
    return true;
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
    return false;
  }
}
