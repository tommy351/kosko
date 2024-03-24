/* eslint-disable node/no-extraneous-import */
import Deployment from "kubernetes-models/apps/v1/Deployment";

export default new Deployment({
  metadata: { name: "my-app" },
  spec: {
    replicas: "wrong_replicas",
    selector: {
      matchLabels: { app: "my-app" }
    }
  }
});
