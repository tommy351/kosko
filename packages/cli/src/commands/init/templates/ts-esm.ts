import { Template } from "./base";
import { baseDependencies } from "./cjs";
import { generateKoskoConfig } from "./kosko-config";
import { generatePackageJson } from "./package-json";
import { generateFromTemplateFile, generateReadme } from "./template";
import { generateTsConfig, generateTsEnvFiles, tsDevDependencies } from "./ts";

const BASE_TSCONFIG = "@tsconfig/node16-strictest-esm";

const tsEsmTemplate: Template = async (ctx) => {
  return {
    dependencies: baseDependencies,
    devDependencies: [...tsDevDependencies, BASE_TSCONFIG],
    files: [
      await generatePackageJson(ctx, {
        type: "module"
      }),
      generateKoskoConfig(`loaders = ["ts-node/esm"]`),
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
      await generateFromTemplateFile(
        "typings/@kosko__env/index.d.ts",
        "ts/typings/kosko-env.d.mts"
      )
    ]
  };
};

export default tsEsmTemplate;
