import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { Service } from "kubernetes-models/v1/Service";
import env from "@kosko/env";

const params = env.component("nginx");

const metadata = { name: "nginx", namespace: params.namespace };
const labels = { app: "nginx" };

const deployment = new Deployment({
  metadata,
  spec: {
    replicas: params.replicas,
    selector: {
      matchLabels: labels
    },
    template: {
      metadata: { labels },
      spec: {
        containers: [
          {
            image: `nginx:${params.imageTag}`,
            name: "nginx",
            ports: [{ containerPort: 80 }]
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
    ports: [{ port: 80 }]
  }
});

export default [deployment, service];
