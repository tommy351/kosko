"use strict";

const { defineConfig } = require("tsup");

/**
 * @param {import('tsup').Options} [options]
 * @returns {import('tsup').Options}
 */
function extend(options) {
  return defineConfig({
    entry: ["src/index.ts"],
    sourcemap: true,
    clean: true,
    outDir: "dist",
    format: ["esm", "cjs"],
    dts: true,
    shims: true,
    minifySyntax: true,
    env: {
      NODE_ENV: "production"
    },
    ...options
  });
}

exports.extend = extend;
exports.default = extend();
