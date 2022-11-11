const { extend } = require("@kosko/tsup-config");

module.exports = [
  extend({
    entry: ["src/index.ts", "src/index-node-esm.ts"],
    format: ["esm"]
  }),
  extend({
    entry: ["src/index-node.ts"],
    format: ["cjs"],
    esbuildOptions(options) {
      options.footer = {
        js: `
// HACK: Export default to module.exports and maintain types above.
module.exports = Object.assign(index_node_exports.default, index_node_exports);
Object.defineProperty(module.exports, "__esModule", { value: true });
`.trim()
      };
    }
  })
];
