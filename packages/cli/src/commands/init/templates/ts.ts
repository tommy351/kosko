import { File, Template, TemplateContext } from "./base";
import { generateKoskoConfig } from "./kosko-config";
import {
  generatePackageJson,
  mergePackageJson,
  PackageJson
} from "./package-json";
import { generateFromTemplateFile, generateReadme } from "./template";

export function generateTsConfig({
  compilerOptions,
  ...data
}: {
  compilerOptions?: Record<string, unknown>;
  [key: string]: unknown;
} = {}): File {
  return {
    path: "tsconfig.json",
    content: JSON.stringify(
      {
        extends: "@tsconfig/recommended/tsconfig.json",
        compilerOptions: {
          typeRoots: ["./node_modules/@types", "./typings"],
          ...compilerOptions
        },
        ...data
      },
      null,
      "  "
    )
  };
}

export function generatePackageJsonTs(
  ctx: TemplateContext,
  data: PackageJson = {}
) {
  return generatePackageJson(
    ctx,
    mergePackageJson(
      {
        devDependencies: {
          "@tsconfig/recommended": "^1.0.1",
          "ts-node": "^10.4.0",
          typescript: "^4.5.3"
        }
      },
      data
    )
  );
}

export function generateKoskoConfigTs() {
  return generateKoskoConfig(`require = ["ts-node/register"]`);
}

export function generateTypeDeclaration() {
  return generateFromTemplateFile(
    "typings/@kosko__env/index.d.ts",
    "ts/typings/kosko-env.d.ts"
  );
}

export function generateTsEnvFiles() {
  return Promise.all([
    generateFromTemplateFile(
      "environments/dev/index.ts",
      "esm/environments/dev/index.js"
    ),
    generateFromTemplateFile(
      "environments/dev/nginx.ts",
      "esm/environments/dev/nginx.js"
    )
  ]);
}

const tsTemplate: Template = async (ctx) => {
  return [
    await generatePackageJsonTs(ctx),
    generateKoskoConfigTs(),
    await generateReadme(),
    generateTsConfig(),
    await generateFromTemplateFile(
      "components/nginx.ts",
      "ts/components/nginx.ts"
    ),
    ...(await generateTsEnvFiles()),
    await generateTypeDeclaration()
  ];
};

export default tsTemplate;
