"use strict";

const visit = require("unist-util-visit");
const esmToCjs = require("./esm-to-cjs");
const tsToEsm = require("./ts-to-esm");

function isImport(node) {
  return node.type === "import";
}

function isParent(node) {
  return Array.isArray(node.children);
}

function matchNode(node) {
  if (node.type !== "code" || !node.meta) return false;

  const meta = node.meta.split(/\s+/g);
  return meta.includes("ts2js");
}

function renderTabItem(label, meta, value) {
  return [
    {
      type: "jsx",
      value: `<TabItem value="${label}">`
    },
    {
      type: "code",
      lang: "typescript",
      meta,
      value
    },
    {
      type: "jsx",
      value: "</TabItem>"
    }
  ];
}

function transformNode(node) {
  const contents = [
    {
      type: "jsx",
      value: `<Tabs groupId="ts2js">`
    },
    ...renderTabItem("TypeScript", node.meta, node.value),
    ...renderTabItem("JavaScript", node.meta, esmToCjs(tsToEsm(node.value))),
    {
      type: "jsx",
      value: "</Tabs>"
    }
  ];

  return contents;
}

const plugin = () => {
  let transformed = false;
  let alreadyImported = false;

  const transformer = (root) => {
    visit(root, (node) => {
      if (isImport(node) && node.value.includes("@theme/Tabs")) {
        alreadyImported = true;
      }

      if (isParent(node)) {
        let index = 0;

        while (index < node.children.length) {
          const child = node.children[index];

          if (matchNode(child)) {
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
      root.children.unshift({
        type: "import",
        value: `import Tabs from '@theme/Tabs';\nimport TabItem from '@theme/TabItem';`
      });
    }
  };

  return transformer;
};

module.exports = plugin;
