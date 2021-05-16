import { loadChart } from "../../mod.ts";
import { path, expect } from "@test/deps.ts";
import { ServiceAccount } from "kubernetes-models/v1/ServiceAccount";
import { Service } from "kubernetes-models/v1/Service";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";

const FIXTURE_DIR = path.join(
  path.fromFileUrl(import.meta.url),
  "../../../__fixtures__"
);

const NGINX_CHART = path.join(FIXTURE_DIR, "nginx");

describe("@kosko/helm loadChart", function () {
  this.timeout(10000);

  test("chart is a local path", async () => {
    const result = loadChart({ chart: NGINX_CHART });
    await expect(result()).to.eventually.deep.equal([
      new ServiceAccount({
        metadata: {
          labels: {
            "app.kubernetes.io/instance": "RELEASE-NAME",
            "app.kubernetes.io/managed-by": "Helm",
            "app.kubernetes.io/name": "nginx",
            "app.kubernetes.io/version": "1.16.0",
            "helm.sh/chart": "nginx-0.1.0"
          },
          name: "RELEASE-NAME-nginx"
        }
      }),
      new Service({
        metadata: {
          labels: {
            "app.kubernetes.io/instance": "RELEASE-NAME",
            "app.kubernetes.io/managed-by": "Helm",
            "app.kubernetes.io/name": "nginx",
            "app.kubernetes.io/version": "1.16.0",
            "helm.sh/chart": "nginx-0.1.0"
          },
          name: "RELEASE-NAME-nginx"
        },
        spec: {
          ports: [
            {
              name: "http",
              port: 80,
              protocol: "TCP",
              targetPort: "http"
            }
          ],
          selector: {
            "app.kubernetes.io/instance": "RELEASE-NAME",
            "app.kubernetes.io/name": "nginx"
          },
          type: "ClusterIP"
        }
      }),
      new Deployment({
        metadata: {
          labels: {
            "app.kubernetes.io/instance": "RELEASE-NAME",
            "app.kubernetes.io/managed-by": "Helm",
            "app.kubernetes.io/name": "nginx",
            "app.kubernetes.io/version": "1.16.0",
            "helm.sh/chart": "nginx-0.1.0"
          },
          name: "RELEASE-NAME-nginx"
        },
        spec: {
          replicas: 1,
          selector: {
            matchLabels: {
              "app.kubernetes.io/instance": "RELEASE-NAME",
              "app.kubernetes.io/name": "nginx"
            }
          },
          template: {
            metadata: {
              labels: {
                "app.kubernetes.io/instance": "RELEASE-NAME",
                "app.kubernetes.io/name": "nginx"
              }
            },
            spec: {
              containers: [
                {
                  image: "nginx:1.16.0",
                  imagePullPolicy: "IfNotPresent",
                  livenessProbe: {
                    httpGet: {
                      path: "/",
                      port: "http"
                    }
                  },
                  name: "nginx",
                  ports: [
                    {
                      containerPort: 80,
                      name: "http",
                      protocol: "TCP"
                    }
                  ],
                  readinessProbe: {
                    httpGet: {
                      path: "/",
                      port: "http"
                    }
                  },
                  resources: {},
                  securityContext: {}
                }
              ],
              securityContext: {},
              serviceAccountName: "RELEASE-NAME-nginx"
            }
          }
        }
      })
    ]);
  });
});
