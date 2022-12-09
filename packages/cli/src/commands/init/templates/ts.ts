import stringify from "fast-safe-stringify";
import { EOL } from "node:os";
import { File, Template } from "./base";
import { baseDependencies } from "./cjs";
import { generateKoskoConfig } from "./kosko-config";
import { generatePackageJson } from "./package-json";
import { generateFromTemplateFile, generateReadme } from "./template";

const BASE_TSCONFIG = "@tsconfig/recommended";

export const tsDevDependencies = ["ts-node", "typescript"];

export function generateTsConfig({
  compilerOptions,
  ...data
}: {
  compilerOptions?: Record<string, unknown>;
  extends?: string;
  [key: string]: unknown;
} = {}): File {
  return {
    path: "tsconfig.json",
    content:
      stringify(
        {
          extends: `${BASE_TSCONFIG}/tsconfig.json`,
          compilerOptions: {
            typeRoots: ["./node_modules/@types", "./typings"],
            moduleResolution: "node",
            ...compilerOptions
          },
          ...data
        },
        undefined,
        "  "
      ) + EOL
  };
}

export function generateTsEnvFiles() {
  return Promise.all([
    generateFromTemplateFile(
      "environments/dev/index.ts",
      "ts/environments/dev/index.ts"
    ),
    generateFromTemplateFile(
      "environments/dev/nginx.ts",
      "ts/environments/dev/nginx.ts"
    )
  ]);
}

const tsTemplate: Template = async (ctx) => {
  return {
    dependencies: baseDependencies,
    devDependencies: [...tsDevDependencies, BASE_TSCONFIG],
    files: [
      await generatePackageJson(ctx),
      generateKoskoConfig(`require = ["ts-node/register"]`),
      await generateReadme(),
      generateTsConfig(),
      await generateFromTemplateFile(
        "components/nginx.ts",
        "ts/components/nginx.ts"
      ),
      ...(await generateTsEnvFiles()),
      await generateFromTemplateFile(
        "typings/@kosko__env/index.d.ts",
        "ts/typings/kosko-env.d.cts"
      )
    ]
  };
};

export default tsTemplate;
