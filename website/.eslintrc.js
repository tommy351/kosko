/* eslint-disable node/no-unpublished-require */
"use strict";

const resolvePkg = require("resolve-pkg");
const readPkg = require("read-pkg");

module.exports = {
  extends: ["../.eslintrc", "plugin:react/recommended"],
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "node/no-unpublished-import": "off",
    "react/prop-types": "off"
  },
  settings: {
    node: {
      allowModules: [
        "@theme/Layout",
        "@theme/CodeBlock",
        "@theme/hooks/usePrismTheme",
        "@theme/hooks/useThemeContext",
        "@docusaurus/Link",
        "@docusaurus/useDocusaurusContext",
        "@docusaurus/useBaseUrl"
      ]
    },
    react: {
      version: readPkg.sync({
        cwd: resolvePkg("react", { cwd: __dirname })
      }).version
    }
  }
};
