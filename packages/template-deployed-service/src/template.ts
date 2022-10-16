import { Template } from "@kosko/template";
import { join } from "node:path";

/**
 * @public
 */
export interface Options {
  name: string;
  image: string;
  type: string;
  servicePort: number;
  containerPort: number;
  replicas: number;
}

/**
 * @public
 */
export const template: Template<Options> = {
  description: "Create a new component including a deployment and a service",
  options: {
    name: {
      type: "string",
      description: "Name of deployment and service",
      required: true
    },
    image: {
      type: "string",
      description: "Container image",
      required: true
    },
    type: {
      type: "string",
      description: "Service type",
      default: "ClusterIP"
    },
    servicePort: {
      type: "number",
      description: "Service port",
      default: 80
    },
    containerPort: {
      type: "number",
      description: "Container port",
      default: 80
    },
    replicas: {
      type: "number",
      description: "Number of replicas",
      default: 1
    }
  },
  generate({ name, image, type, servicePort, containerPort, replicas }) {
    return {
      files: [
        {
          path: join("components", name + ".js"),
          content: `"use strict";

const { Deployment } = require("kubernetes-models/apps/v1/Deployment");
const { Service } = require("kubernetes-models/v1/Service");

const metadata = { name: "${name}" };
const labels = { app: "${name}" };

const deployment = new Deployment({
  metadata,
  spec: {
    replicas: ${replicas},
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
            image: "${image}",
            name: "${name}",
            ports: [{
              containerPort: ${containerPort}
            }]
          }
        ]
      }
    }
  }
});

const service = new Service({
  metadata,
  spec: {
    selector: labels,
    type: "${type}",
    ports: [
      {
        port: ${servicePort},
        targetPort: ${containerPort}
      }
    ]
  }
});

module.exports = [deployment, service];
`
        }
      ]
    };
  }
};
