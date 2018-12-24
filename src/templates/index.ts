import requireDir from "require-dir";
import { basename, extname } from "path";
import { getDefault } from "../utils/require";

export * from "./base";

export const templates = requireDir(".", {
  filter(path: string) {
    return basename(path, extname(path)) !== "base";
  },
  mapValue: getDefault
});
