/* eslint-disable no-undef */
new Deployment({
  metadata: {
    name: "my-app"
  },
  spec: {
    replicas: "wrong_replicas",
    selector: {
      matchLabels: {
        app: "my-app"
      }
    }
  }
});
