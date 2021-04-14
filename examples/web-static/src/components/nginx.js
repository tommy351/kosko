import { Deployment } from "https://cdn.skypack.dev/kubernetes-models/apps/v1/Deployment";
import { Service } from "https://cdn.skypack.dev/kubernetes-models/v1/Service";
import env from "https://cdn.skypack.dev/@kosko/env";

export default async function () {
  const params = await env.component("nginx");
  const metadata = { name: "nginx" };
  const labels = { app: "nginx" };

  const deployment = new Deployment({
    metadata,
    spec: {
      replicas: params.replicas,
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
              image: `${params.imageRegistry}/nginx:${params.imageTag}`,
              name: "nginx",
              ports: [
                {
                  containerPort: 80
                }
              ]
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
      type: "ClusterIP",
      ports: [
        {
          port: 80,
          targetPort: 80
        }
      ]
    }
  });

  return [deployment, service];
}
