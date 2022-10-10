import stringify from "fast-safe-stringify";
import { File, Template } from "./base";
import { generateKoskoConfig } from "./kosko-config";
import { generatePackageJson } from "./package-json";
import { generateFromTemplateFile, generateReadme } from "./template";

const BASE_TSCONFIG = "@tsconfig/recommended";

export const tsDevDependencies = {
  "ts-node": "^10.4.0",
  typescript: "^4.5.3"
};

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
    content: stringify(
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
    )
  };
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
      "ts/environments/dev/index.ts"
    ),
    generateFromTemplateFile(
      "environments/dev/nginx.ts",
      "ts/environments/dev/nginx.ts"
    )
  ]);
}

const tsTemplate: Template = async (ctx) => {
  return [
    await generatePackageJson(ctx, {
      devDependencies: {
        ...tsDevDependencies,
        [BASE_TSCONFIG]: "^1.0.1"
      }
    }),
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
