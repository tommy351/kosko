"use strict";

const resolvePkg = require("resolve-pkg");
const readPkg = require("read-pkg");

module.exports = {
  extends: ["../.eslintrc", "plugin:react/recommended"],
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off"
  },
  settings: {
    react: {
      version: readPkg.sync({
        cwd: resolvePkg("react", { cwd: __dirname })
      }).version
    }
  }
};
