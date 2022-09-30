const { Pod } = require("kubernetes-models/v1");

module.exports = new Pod({
  metadata: {
    name: "foo"
  },
  spec: {
    containers: []
  }
});
