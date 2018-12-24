import { Template } from "./base";
import { join } from "path";
import { ENVIRONMENT_DIR } from "../context";
import assert from "assert";

interface Data {
  name: string;
}

const template: Template<Data> = {
  validate(data) {
    assert(data.name);
  },
  async generate(data) {
    const dir = join(ENVIRONMENT_DIR, data.name);

    return [
      {
        path: join(dir, "index.js"),
        content: `const requireDir = require("require-dir");

exports.globals = {};

exports.components = requireDir(".", {
  mapValue: function(value) {
    return {
      ...exports.globals,
      ...(value.default || value)
    };
  }
});
`
      }
    ];
  }
};

export default template;
