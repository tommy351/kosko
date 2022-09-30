import { Deployment } from "kubernetes-models/apps/v1";
import { Service } from "kubernetes-models/v1";

const labels = { app: "nginx" };

const deployment = new Deployment({
  metadata: {
    name: "nginx"
  },
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

export default [deployment, service];
