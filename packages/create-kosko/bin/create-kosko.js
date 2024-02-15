#!/usr/bin/env node

const cli = require("../dist/index.node.cjs");
cli.run().catch(cli.handleError);
