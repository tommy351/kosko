import { safeLoadAll } from "js-yaml";
import fs from "fs";
import { promisify } from "util";
import { FunctionComponent } from "./types";

const readFile = promisify(fs.readFile);

export function loadYAMLFile(path: string): FunctionComponent {
  return async () => {
    const content = await readFile(path, "utf-8");
    return safeLoadAll(content).filter(Boolean);
  };
}
