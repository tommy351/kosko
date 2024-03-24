/* eslint-disable node/no-extraneous-import */
import env from "@kosko/env";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";

const params = env.component("nginx");

export default new Deployment({
  metadata: { name: "nginx", namespace: params.namespace },
  spec: {
    replicas: params.replicas,
    template: {
      spec: {
        containers: [{ name: "nginx", image: params.image }]
      }
    }
  }
});
