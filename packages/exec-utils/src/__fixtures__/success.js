#!/usr/bin/env node
/* eslint-disable node/shebang */

console.log("stdout test");
console.log(process.argv.slice(2).join("|"));
