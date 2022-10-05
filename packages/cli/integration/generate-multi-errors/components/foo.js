const { Pod } = require("kubernetes-models/v1/Pod");

const pod = new Pod({
  metadata: { name: "foo" },
  spec: {}
});

module.exports = [pod];
