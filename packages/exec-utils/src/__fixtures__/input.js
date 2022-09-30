#!/usr/bin/env node
/* eslint-disable node/shebang */

const getStdin = require("get-stdin");

(async () => {
  console.log("input test");
  console.log(await getStdin());
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
