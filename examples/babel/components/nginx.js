import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { Service } from "kubernetes-models/v1/Service";

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

export default [deployment, service];
