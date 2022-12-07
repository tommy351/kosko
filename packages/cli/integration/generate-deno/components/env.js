import { Deployment } from "npm:kubernetes-models@^4/apps/v1/Deployment";
import env from "npm:@kosko/env";

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
