const { Pod } = require("kubernetes-models/v1/Pod");
const env = require("@kosko/env");

const params = env.global();

module.exports = new Pod({
  metadata: {
    name: "cjs-pod",
    labels: params
  }
});
