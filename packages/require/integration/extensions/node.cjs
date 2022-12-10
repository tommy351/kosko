"use strict";

const { getRequireExtensions } = require("../../dist/index.node.cjs");

process.stdout.write(JSON.stringify(getRequireExtensions()));
