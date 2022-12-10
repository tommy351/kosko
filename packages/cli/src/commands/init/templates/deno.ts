import { Template } from "./base";
import { generateKoskoConfig } from "./kosko-config";
import { generateFromTemplateFile } from "./template";
import { generateTsEnvFiles } from "./ts";

const TEMPLATE_FILES = ["deno.json", "env.ts", "import_map.json", "README.md"];

const denoTemplate: Template = async () => {
  return {
    files: [
      generateKoskoConfig(),
      ...(await Promise.all(
        TEMPLATE_FILES.map((file) =>
          generateFromTemplateFile(`${file}`, `deno/${file}`)
        )
      )),
      await generateFromTemplateFile(
        "components/nginx.ts",
        "esm/components/nginx.js"
      ),
      ...(await generateTsEnvFiles())
    ]
  };
};

export default denoTemplate;
