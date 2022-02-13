import { File } from "./base";

export function generateKoskoConfig(additionalConfig?: string): File {
  return {
    path: "kosko.toml",
    content: `components = ["*"]\n${
      additionalConfig ? additionalConfig + "\n" : ""
    }`
  };
}
