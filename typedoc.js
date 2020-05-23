"use strict";

module.exports = {
  name: "Kosko",
  mode: "modules",
  plugin: ["typedoc-plugin-lerna-packages"],
  exclude: [
    "examples/**/*",
    "integration/**/*",
    "**/__tests__/**",
    "**/__fixtures__/**",
    "**/__mocks__/**"
  ],
  out: "website/build/api",
  excludePrivate: true,
  excludeNotExported: true,
  lernaExclude: ["kosko", "@kosko/website"],
  readme: "README.md"
};
