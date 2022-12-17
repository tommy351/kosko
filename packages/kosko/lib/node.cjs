"use strict";

const importLocal = require("import-local");

if (!importLocal(__filename)) {
  require("@kosko/cli/bin/kosko.js");
}
