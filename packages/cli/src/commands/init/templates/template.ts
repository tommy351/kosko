import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { File } from "./base";

const TEMPLATE_DIR = join(
  fileURLToPath(import.meta.url),
  // eslint-disable-next-line no-restricted-globals
  process.env.BUILD_PROD ? "../../templates" : "../../../../../templates"
);

export async function generateFromTemplateFile(
  path: string,
  template = path
): Promise<File> {
  return {
    path,
    content: await readFile(join(TEMPLATE_DIR, template), "utf8")
  };
}

export function generateReadme() {
  return generateFromTemplateFile("README.md");
}
