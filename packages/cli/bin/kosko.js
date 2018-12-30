#!/usr/bin/env node

const cli = require("../dist");

cli.run().catch(cli.handleError);

// .catch(require("@oclif/errors/handle"));
