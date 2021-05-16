import { handleError } from "./utils";
import rimraf from "rimraf";

export async function remove(path: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    rimraf(path, (err) => {
      if (err) return reject(handleError(err));
      resolve();
    });
  });
}
