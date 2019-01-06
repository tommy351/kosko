import { Template } from "@kosko/template";
import { join } from "path";

interface Options {
  name: string;
}

export const INDEX_SCRIPT = `"use strict";

const requireDir = require("require-dir");

exports.globals = {};

exports.components = requireDir(".", {
  mapValue: function(value) {
    return {
      ...exports.globals,
      ...(value.default || value)
    };
  }
});
`;

export const template: Template<Options> = {
  description: "Create a new environment",
  options: {
    name: {
      type: "string",
      description: "Environment name",
      required: true
    }
  },
  async generate({ name }) {
    return {
      files: [
        {
          path: join("environments", name, "index.js"),
          content: INDEX_SCRIPT
        }
      ]
    };
  }
};
