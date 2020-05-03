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
  excludePrivate: true,
  excludeNotExported: true,
  links: [
    {
      label: "GitHub",
      url: GITHUB_URL
    }
  ],
  outline: [
    {
      Packages: {
        "@kosko/cli": "cli",
        "@kosko/config": "config",
        "@kosko/env": "env",
        "@kosko/generate": "generate",
        "@kosko/migrate": "migrate"
      },
      Utilities: {
        "@kosko/require": "require"
      },
      Template: {
        "@kosko/template": "template",
        "@kosko/template-deployed-service": "template_deployed_service",
        "@kosko/template-environment": "template_environment"
      }
    }
  ],
  source: [
    {
      path: `${GITHUB_URL}/tree/${process.env.COMMIT_REF || "master"}/`,
      line: "L"
    }
  ],
  readme: "README.md"
};
