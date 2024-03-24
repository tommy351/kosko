/* eslint-disable node/no-extraneous-import */
import { Deployment } from "kubernetes-models/apps/v1/Deployment";

export default new Deployment({
  metadata: { name: "nginx" },
  spec: {
    selector: { matchLabels: { app: "nginx" } },
    template: {
      metadata: { name: "nginx" },
      spec: {
        containers: [{ name: "nginx", image: "nginx:stable" }]
      }
    }
  }
});
