// @ts-check

import { visit } from "unist-util-visit";
import esmToCjs from "./esm-to-cjs.js";
import tsToEsm from "./ts-to-esm.js";

/**
 * @param {import('unist').Node} node
 * @returns {node is import('unist').Parent}
 */
function isParent(node) {
  return Array.isArray(node.children);
}

/**
 * @param {import('unist').Node} node
 * @returns {node is import('mdast').Literal}
 */
function isMdxEsmLiteral(node) {
  return node.type === "mdxJsEsm";
}

/**
 * @param {import('unist').Node} node
 * @returns {boolean}
 */
function isTabsImport(node) {
  return isMdxEsmLiteral(node) && node.value.includes("@theme/Tabs");
}

/**
 * @param {import('unist').Node} node
 * @returns {node is import('mdast').Code}
 */
function isCode(node) {
  return node.type === "code";
}

/**
 * @param {string} name
 * @param {string} path
 */
function newImportDefaultNode(name, path) {
  return {
    type: "mdxjsEsm",
    value: `import ${name} from ${JSON.stringify(path)}`,
    data: {
      estree: {
        type: "Program",
        body: [
          {
            type: "ImportDeclaration",
            specifiers: [
              {
                type: "ImportDefaultSpecifier",
                local: { type: "Identifier", name }
              }
            ],
            source: {
              type: "Literal",
              value: path,
              raw: JSON.stringify(path)
            }
          }
        ],
        sourceType: "module"
      }
    }
  };
}

/**
 * @param {string} name
 * @param {string} value
 */
function newJsxAttribute(name, value) {
  return { type: "mdxJsxAttribute", name, value };
}

/**
 *
 * @param {{
 *   tabLabel: string;
 *   tabValue: string;
 *   value: string;
 * }} options
 */
function newTabItem({ tabLabel, tabValue, value }) {
  return {
    type: "mdxJsxFlowElement",
    name: "TabItem",
    attributes: [
      newJsxAttribute("value", tabValue),
      newJsxAttribute("label", tabLabel)
    ],
    children: [
      {
        type: "code",
        lang: "typescript",
        value
      }
    ]
  };
}

/**
 * @param {import('mdast').Code} node
 */
function transformNode(node) {
  const esm = tsToEsm(node.value);
  const cjs = esmToCjs(esm);

  return [
    {
      type: "mdxJsxFlowElement",
      name: "Tabs",
      attributes: [newJsxAttribute("groupId", "ts2js")],
      children: [
        newTabItem({
          tabValue: "ts",
          tabLabel: "TypeScript",
          value: node.value
        }),
        newTabItem({
          tabValue: "esm",
          tabLabel: "JavaScript (ESM)",
          value: esm
        }),
        newTabItem({
          tabValue: "cjs",
          tabLabel: "JavaScript (CJS)",
          value: cjs
        })
      ]
    }
  ];
}

/**
 * @returns {import('unified').Transformer}
 */
export default function () {
  return (root) => {
    let transformed = false;
    let alreadyImported = false;

    visit(root, (node) => {
      if (isTabsImport(node)) {
        alreadyImported = true;
      }

      if (isParent(node)) {
        let index = 0;

        while (index < node.children.length) {
          const child = node.children[index];

          if (isCode(child) && child.meta?.includes("ts2js")) {
            const result = transformNode(child);
            node.children.splice(index, 1, ...result);
            index += result.length;
            transformed = true;
          } else {
            index++;
          }
        }
      }
    });

    if (transformed && !alreadyImported) {
      root.children.unshift(
        newImportDefaultNode("Tabs", "@theme/Tabs"),
        newImportDefaultNode("TabItem", "@theme/TabItem")
      );
    }
  };
}
