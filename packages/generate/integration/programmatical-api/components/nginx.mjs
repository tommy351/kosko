import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { Service } from "kubernetes-models/v1/Service";
import env from "@kosko/env";

const params = await env.component("nginx");

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
            image: `${params.image.registry}/nginx`
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
