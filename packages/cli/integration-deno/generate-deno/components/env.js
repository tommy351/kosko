import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import env from "@kosko/env";

const params = await env.component("env");

export default new Deployment({
  metadata: { name: "env", namespace: params.namespace },
  spec: {
    replicas: params.replicas,
    selector: {
      matchLabels: { app: "env" }
    },
    template: {
      containers: []
    }
  }
});
