"use strict";

const { run } = require("@kosko/template");

run({
  description: "Create a new HPA",
  options: {
    deployment: {
      type: "string",
      description: "Deployment name",
      required: true
    },
    minReplicas: {
      type: "number",
      description: "Minimum number of replicas",
      default: 1
    },
    maxReplicas: {
      type: "number",
      description: "Maximum number of replicas",
      required: true
    },
    cpu: {
      type: "number",
      description: "Target CPU utilization",
      default: 70
    }
  },
  async generate(args) {
    return {
      files: [
        {
          path: `components/${args.deployment}_hpa.js`,
          content: `"use strict";

const { HorizontalPodAutoscaler } = require("kubernetes-models/autoscaling/v1");

module.exports = new HorizontalPodAutoscaler({
  metadata: {
    name: "${args.deployment}"
  },
  spec: {
    scaleTargetRef: {
      apiVersion: "apps/v1",
      kind: "Deployment",
      name: "${args.deployment}"
    },
    minReplicas: ${args.minReplicas},
    maxReplicas: ${args.maxReplicas},
    targetCPUUtilizationPercentage: ${args.cpu}
  }
});
`
        }
      ]
    };
  }
});
