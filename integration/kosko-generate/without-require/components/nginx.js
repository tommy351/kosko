const { Deployment } = require("kubernetes-models/apps/v1");
const { Service } = require("kubernetes-models/v1");
const params = require("@kosko/env").component("nginx");

const labels = { app: "nginx" };

const deployment = new Deployment({
  metadata: {
    name: "nginx",
    ...params.metadata
  },
  spec: {
    replicas: params.replicas,
    selector: {
      matchLabels: labels
    },
    template: {
      metadata: {
        labels
      },
      spec: {
        containers: [
          {
            name: "nginx",
            image: `${params.image.registry}/nginx`
          }
        ],
        tolerations: params.tolerations
      }
    }
  }
});

const service = new Service({
  metadata: {
    name: "nginx"
  },
  spec: {
    selector: labels,
    ports: [
      {
        port: 80
      }
    ]
  }
});

module.exports = [deployment, service];
