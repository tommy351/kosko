import { Template } from "./base";
import { generateKoskoConfig } from "./kosko-config";
import { generatePackageJson } from "./package-json";
import { generateFromTemplateFile, generateReadme } from "./template";

const TEMPLATE_FILES = [
  "components/nginx",
  "environments/dev/index",
  "environments/dev/nginx"
];

export const baseDependencies = ["@kosko/env", "kosko", "kubernetes-models"];

const cjsTemplate: Template = async (ctx) => {
  return {
    dependencies: baseDependencies,
    files: [
      await generatePackageJson(ctx),
      generateKoskoConfig(),
      await generateReadme(),
      ...(await Promise.all(
        TEMPLATE_FILES.map((file) =>
          generateFromTemplateFile(`${file}.js`, `cjs/${file}.js`)
        )
      ))
    ]
  };
};

export default cjsTemplate;
