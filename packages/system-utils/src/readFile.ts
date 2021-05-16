import fs from "fs";
import { handleError } from "./utils";

export function readFile(path: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) return reject(handleError(err));
      resolve(data);
    });
  });
}
