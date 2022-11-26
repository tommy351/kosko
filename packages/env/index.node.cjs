"use strict";

const mod = require("./dist/index.node.cjs");

// HACK: Export default to module.exports and maintain types.
module.exports = Object.assign(mod.default, mod);
