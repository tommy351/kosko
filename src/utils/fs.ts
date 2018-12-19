import fs from "fs";
import { promisify } from "util";

export const access = promisify(fs.access);
export const readDir = promisify(fs.readdir);
export const stat = promisify(fs.stat);

export async function exists(path: string, mode?: number) {
  try {
    await access(path, mode);
    return true;
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
    return false;
  }
}
