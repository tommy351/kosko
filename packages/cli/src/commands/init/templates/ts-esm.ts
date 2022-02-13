import { Template } from "./base";
import { generateFromTemplateFile, generateReadme } from "./template";
import {
  generateKoskoConfigTs,
  generatePackageJsonTs,
  generateTsConfig,
  generateTsEnvFiles,
  generateTypeDeclaration
} from "./ts";

const tsEsmTemplate: Template = async (ctx) => {
  return [
    await generatePackageJsonTs(ctx, { type: "module" }),
    generateKoskoConfigTs(),
    await generateReadme(),
    generateTsConfig({
      compilerOptions: {
        module: "esnext"
      }
    }),
    await generateFromTemplateFile(
      "components/nginx.ts",
      "esm/components/nginx.js"
    ),
    ...(await generateTsEnvFiles()),
    await generateTypeDeclaration()
  ];
};

export default tsEsmTemplate;
