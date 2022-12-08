import { Template } from "./base";
import { generateKoskoConfig } from "./kosko-config";
import { generateFromTemplateFile } from "./template";

const TEMPLATE_FILES = [
  "components/nginx.ts",
  "environments/dev/index.ts",
  "environments/dev/nginx.ts",
  "environments/types.d.ts",
  "deno.json",
  "README.md"
];

const denoTemplate: Template = async () => {
  return {
    files: [
      generateKoskoConfig(),
      ...(await Promise.all(
        TEMPLATE_FILES.map((file) =>
          generateFromTemplateFile(`${file}`, `deno/${file}`)
        )
      ))
    ]
  };
};

export default denoTemplate;
