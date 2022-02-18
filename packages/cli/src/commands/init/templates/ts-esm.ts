import { Template } from "./base";
import { generatePackageJson } from "./package-json";
import { generateFromTemplateFile, generateReadme } from "./template";
import {
  generateKoskoConfigTs,
  generateTsConfig,
  generateTsEnvFiles,
  generateTypeDeclaration,
  tsDevDependencies
} from "./ts";

const BASE_TSCONFIG = "@tsconfig/node16-strictest-esm";
const SCRIPT_PREFIX = `NODE_OPTIONS='--loader=ts-node/esm'`;

const tsEsmTemplate: Template = async (ctx) => {
  return [
    await generatePackageJson(ctx, {
      type: "module",
      devDependencies: {
        ...tsDevDependencies,
        [BASE_TSCONFIG]: "^1.0.0"
      },
      scripts: {
        generate: `${SCRIPT_PREFIX} kosko generate`,
        validate: `${SCRIPT_PREFIX} kosko validate`
      }
    }),
    generateKoskoConfigTs(),
    await generateReadme(),
    generateTsConfig({
      extends: `${BASE_TSCONFIG}/tsconfig.json`,
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
