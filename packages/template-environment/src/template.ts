import { Template } from "@kosko/template";
import { join } from "node:path";
import { BUILD_TARGET } from "@kosko/build-scripts";

/**
 * @public
 */
export interface Options {
  name: string;
  esm: boolean;
}

const esmContent = `export default {}`;

const cjsContent = `"use strict";

module.exports = {};
`;

/**
 * @public
 */
export const template: Template<Options> = {
  description: "Create a new environment",
  options: {
    name: {
      type: "string",
      description: "Environment name",
      required: true
    },
    esm: {
      type: "boolean",
      description: "Generate ECMAScript module (ESM) files",
      default: BUILD_TARGET !== "node"
    }
  },
  async generate({ name, esm }) {
    return {
      files: [
        {
          path: join("environments", name, "index.js"),
          content: esm ? esmContent : cjsContent
        }
      ]
    };
  }
};
