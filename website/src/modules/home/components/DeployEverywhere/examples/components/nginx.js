/* eslint-disable no-undef, node/no-missing-require */
const env = require("@kosko/env");
const params = env.component("nginx");

module.exports = new Deployment({
  metadata: {
    name: "nginx",
    namespace: params.namespace
  },
  spec: {
    replicas: params.replicas,
    template: {
      spec: {
        containers: [
          {
            name: "nginx",
            image: params.image
          }
        ]
      }
    }
  }
});
