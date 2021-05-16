import { ensureDir } from "./ensureDir";
import p from "path";
import fs from "fs";
import { handleError } from "./utils";

export async function writeFile(path: string, data: string): Promise<void> {
  await ensureDir(p.dirname(path));

  return new Promise<void>((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) return reject(handleError(err));
      resolve();
    });
  });
}
