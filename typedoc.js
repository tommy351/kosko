"use strict";

const GITHUB_URL = "https://github.com/tommy351/kosko";

module.exports = {
  name: "Kosko",
  mode: "modules",
  plugin: ["typedoc-neo-theme", "@strictsoftware/typedoc-plugin-monorepo"],
  theme: "./node_modules/typedoc-neo-theme/bin/default",
  exclude: [
    "examples/**/*",
    "integration/**/*",
    "**/__tests__/**",
    "**/__fixtures__/**",
    "**/__mocks__/**"
  ],
  out: "dist/typedoc",
  "external-modulemap": /packages\/([^/]+)\/.*/,
  links: [
    {
      label: "GitHub",
      url: GITHUB_URL
    }
  ],
  source: [
    {
      path: `${GITHUB_URL}/tree/master/`,
      line: "L"
    }
  ],
  readme: "README.md"
};
