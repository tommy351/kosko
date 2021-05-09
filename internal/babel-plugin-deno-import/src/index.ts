import type babel from "@babel/core";
import type { StringLiteral } from "@babel/types";
import { getDependencyVersion, isBuiltinModule, isRelativePath } from "./utils";

function rewriteModuleSpecifier(source: string, mod: string): string {
  if (isRelativePath(mod)) {
    return `${mod}.ts`;
  }

  if (isBuiltinModule(mod)) {
    return `https://deno.land/std@0.95.0/node/${mod}.ts`;
  }

  const version = getDependencyVersion(source, mod);
  const suffix = mod.startsWith("@kosko/") ? "/mod.ts" : "?dts";

  return `https://cdn.skypack.dev/${mod}@${version}${suffix}`;
}

export default function ({ types: t }: typeof babel): babel.PluginObj {
  function replaceModuleSpecifier(
    source: string,
    path: babel.NodePath<StringLiteral>
  ) {
    path.replaceWith(
      t.stringLiteral(rewriteModuleSpecifier(source, path.node.value))
    );
  }

  return {
    visitor: {
      ImportDeclaration(path) {
        replaceModuleSpecifier(this.filename, path.get("source"));
      },
      ExportAllDeclaration(path) {
        replaceModuleSpecifier(this.filename, path.get("source"));
      },
      ExportNamedDeclaration(path) {
        const source = path.get("source");

        if (source.isStringLiteral()) {
          replaceModuleSpecifier(this.filename, source);
        }
      }
    }
  };
}
