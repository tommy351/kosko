"use strict";

const { HorizontalPodAutoscaler } = require("kubernetes-models/autoscaling/v1");

module.exports = new HorizontalPodAutoscaler({
  metadata: {
    name: "nginx"
  },
  spec: {
    scaleTargetRef: {
      apiVersion: "apps/v1",
      kind: "Deployment",
      name: "nginx"
    },
    minReplicas: 2,
    maxReplicas: 6,
    targetCPUUtilizationPercentage: 70
  }
});
