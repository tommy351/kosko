"use strict";

const { Deployment } = require("kubernetes-models/apps/v1/Deployment");
const { Service } = require("kubernetes-models/v1/Service");

const metadata = { name: "nginx" };
const labels = { app: "nginx" };

const deployment = new Deployment({
  metadata,
  spec: {
    replicas: 1,
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
            image: "nginx",
            name: "nginx",
            ports: [
              {
                containerPort: 80
              }
            ]
          }
        ]
      }
    }
  }
});

const service = new Service({
  metadata,
  spec: {
    selector: labels,
    type: "ClusterIP",
    ports: [
      {
        port: 80,
        targetPort: 80
      }
    ]
  }
});

module.exports = [deployment, service];
