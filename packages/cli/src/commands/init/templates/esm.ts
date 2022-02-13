import { Template } from "./base";
import { generateKoskoConfig } from "./kosko-config";
import { generatePackageJson } from "./package-json";
import { generateFromTemplateFile, generateReadme } from "./template";

const TEMPLATE_FILES = [
  "components/nginx",
  "environments/dev/index",
  "environments/dev/nginx"
];

const esmTemplate: Template = async (ctx) => {
  return [
    await generatePackageJson(ctx, {
      type: "module"
    }),
    generateKoskoConfig(),
    await generateReadme(),
    ...(await Promise.all(
      TEMPLATE_FILES.map((file) =>
        generateFromTemplateFile(`${file}.js`, `esm/${file}.js`)
      )
    ))
  ];
};

export default esmTemplate;
