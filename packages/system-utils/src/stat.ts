import fs from "fs";
import { Stats } from "./types";
import { handleError } from "./utils";

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
