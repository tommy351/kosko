const { Deployment } = require("kubernetes-models/api/apps/v1");
const { Service } = require("kubernetes-models/api/core/v1");
const params = require("../environments").components.nginx;

const labels = { app: "nginx" };

const deployment = new Deployment({
  metadata: {
    name: "nginx"
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
            image: "nginx"
          }
        ]
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
