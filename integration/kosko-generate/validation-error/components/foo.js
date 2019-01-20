const { Pod } = require("kubernetes-models/api/core/v1");

module.exports = new Pod({
  metadata: {
    name: "foo"
  },
  spec: {}
});
