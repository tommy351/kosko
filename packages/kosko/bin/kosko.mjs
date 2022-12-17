#!/usr/bin/env node

if (typeof Deno !== "undefined") {
  await import("../lib/deno.mjs");
} else {
  await import("../lib/node.cjs");
}
