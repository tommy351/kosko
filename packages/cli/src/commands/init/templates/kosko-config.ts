import { EOL } from "node:os";
import { File } from "./base";

export function generateKoskoConfig(additionalConfig?: string): File {
  return {
    path: "kosko.toml",
    content:
      [
        `components = ["*"]`,
        ...(additionalConfig ? [additionalConfig] : [])
      ].join(EOL) + EOL
  };
}
