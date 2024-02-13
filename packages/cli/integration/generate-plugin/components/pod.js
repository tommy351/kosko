const { ConfigMap } = require("kubernetes-models/v1/ConfigMap");

const configMap = new ConfigMap({
  metadata: { name: "test" }
});

module.exports = configMap;
