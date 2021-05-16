import fs from "fs";

export function pathExists(path: string): Promise<boolean> {
  return new Promise((resolve) => {
    fs.access(path, (err) => {
      resolve(!err);
    });
  });
}
