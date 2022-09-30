#!/usr/bin/env node
/* eslint-disable node/shebang */

require("@kosko/template").run({
  description: "This is a fake template.",
  options: {
    foo: { type: "string", description: "option foo" },
    bar: { type: "number", description: "option bar", required: true }
  },
  generate: async ({ foo, bar }) => ({
    files: [
      { path: "foo", content: `${foo}` },
      { path: "bar/baz", content: `${bar}` }
    ]
  })
});
