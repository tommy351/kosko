import fs from "fs";
import { handleError } from "./utils";

export function readDir(path: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err) return reject(handleError(err));
      resolve(files);
    });
  });
}
