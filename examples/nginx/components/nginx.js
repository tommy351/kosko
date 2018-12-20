const { Deployment } = require("kubernetes-models/api/apps/v1");

const labels = { app: "nginx" };

module.exports = new Deployment({
  metadata: {
    name: "nginx"
  },
  spec: {
    replicas: kosko.env.replicas,
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
            image: "nginx"
          }
        ]
      }
    }
  }
});
