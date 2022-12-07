import { Deployment } from "npm:kubernetes-models/apps/v1/Deployment";
import { Service } from "npm:kubernetes-models/v1/Service";
import env from "npm:@kosko/env";

const params = await env.component("nginx");

const name = "nginx";
const labels = { app: name };
const port = 80;

const deployment = new Deployment({
  metadata: {
    name,
    namespace: params.namespace
  },
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
            name: "nginx",
            image: "nginx:stable",
            ports: [{ containerPort: port }],
            env: [{ name: "NGINX_PORT", value: `${port}` }]
          }
        ]
      }
    }
  }
});

const service = new Service({
  metadata: {
    name,
    namespace: params.namespace
  },
  spec: {
    selector: labels,
    ports: [{ port }]
  }
});

export default [deployment, service];
