#!/usr/bin/env node

require("../dist")
  .run()
  .catch(require("@oclif/errors/handle"));
