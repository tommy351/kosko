"use strict";

const resolvePkg = require("resolve-pkg");
const readPkg = require("read-pkg");

module.exports = {
  extends: ["../.eslintrc", "plugin:react/recommended"],
  settings: {
    react: {
      version: readPkg.sync({
        cwd: resolvePkg("react", { cwd: __dirname })
      }).version
    }
  }
};
