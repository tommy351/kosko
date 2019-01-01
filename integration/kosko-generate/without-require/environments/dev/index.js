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
