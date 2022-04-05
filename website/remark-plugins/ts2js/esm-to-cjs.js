"use strict";

const MagicString = require("magic-string");
const babel = require("@babel/core");
const traverse = require("@babel/traverse").default;
const prettier = require("./prettier");

function esmToCjs(input) {
  const ast = babel.parseSync(input, {
    filename: "file.js",
    sourceType: "module"
  });
  const source = new MagicString(input);

  traverse(ast, {
    ImportDeclaration(path) {
      const { node } = path;
      const requireStmt = `require(${node.source.extra.raw})`;

      // import "module";
      // import {} from "module";
      if (!node.specifiers.length) {
        source.overwrite(node.start, node.end, `${requireStmt};`);
        return;
      }

      // import * as mod from "module";
      if (node.specifiers.length === 1) {
        const first = node.specifiers[0];

        if (
          babel.types.isImportNamespaceSpecifier(first) ||
          babel.types.isImportDefaultSpecifier(first)
        ) {
          source.overwrite(
            node.start,
            node.end,
            `const ${node.specifiers[0].local.name} = ${requireStmt};`
          );
          return;
        }
      }

      const specs = [];

      for (const spec of node.specifiers) {
        if (babel.types.isImportDefaultSpecifier(spec)) {
          // import a from "module";
          specs.push(`default: ${spec.local.name}`);
        } else if (babel.types.isImportSpecifier(spec)) {
          if (spec.imported.name === spec.local.name) {
            // import { b } from "module";
            specs.push(spec.imported.name);
          } else {
            // import { c as d } from "module";
            specs.push(`${spec.imported.name}: ${spec.local.name}`);
          }
        }
      }

      source.overwrite(
        node.start,
        node.end,
        `const { ${specs.join(", ")} } = ${requireStmt};`
      );
    },
    ExportDefaultDeclaration(path) {
      // export default mod;
      source.overwrite(
        path.node.start,
        path.node.declaration.start,
        "exports.default = "
      );
    },
    ExportNamedDeclaration(path) {
      if (path.node.declaration) {
        // export const a = 1;
        // export function b() {}
        source.remove(path.node.start, path.node.declaration.start);

        for (const decl of path.node.declaration.declarations) {
          const name = decl.id.name;

          source.prependRight(path.node.end, `\nexports.${name} = ${name};`);
        }
      } else {
        // export { a, b };
        source.remove(path.node.start, path.node.end);

        for (const spec of path.node.specifiers) {
          source.prependRight(
            path.node.end,
            `\nexports.${spec.exported.name} = ${spec.local.name};`
          );
        }
      }
    }
  });

  return prettier(source.toString());
}

module.exports = esmToCjs;
