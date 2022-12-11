/// <reference types="jest-extended"/>
import { isPlainObject } from "is-plain-object";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { ConfigMap } from "kubernetes-models/v1/ConfigMap";
import { Pod } from "kubernetes-models/v1/Pod";
import { Service } from "kubernetes-models/v1/Service";
import { ClusterRoleBinding } from "kubernetes-models/rbac.authorization.k8s.io/v1/ClusterRoleBinding";
import Module from "node:module";
import { runInThisContext } from "node:vm";
import { Manifest, migrate, MigrateFormat, migrateString } from "../migrate";

describe("migrate", () => {
  let data: Manifest[];
  let code: string;
  let exported: any;

  async function execute(): Promise<void> {
    code = await migrate(data);

    const mod = new Module("");
    const fn = runInThisContext(Module.wrap(code));
    fn(mod.exports, require, mod, "", "");
    exported = mod.exports;
  }

  describe("given no manifests", () => {
    beforeAll(() => {
      data = [];
    });

    beforeEach(execute);

    test("should generate code", () => {
      expect(code).toMatchSnapshot();
    });

    test("should export an empty array", () => {
      expect(exported).toBeArrayOfSize(0);
    });
  });

  describe("given single manifest", () => {
    beforeAll(() => {
      data = [
        {
          apiVersion: "v1",
          kind: "Pod",
          metadata: { name: "test-pod" },
          spec: {
            containers: []
          }
        }
      ];
    });

    beforeEach(execute);

    test("should generate code", () => {
      expect(code).toMatchSnapshot();
    });

    test("should export an array containing a pod", () => {
      expect(exported).toMatchSnapshot();
    });

    test("should export a Pod instance", () => {
      expect(exported[0]).toBeInstanceOf(Pod);
    });
  });

  describe("given multiple manifests of different kinds", () => {
    beforeAll(() => {
      data = [
        {
          apiVersion: "apps/v1",
          kind: "Deployment",
          metadata: { name: "test-deployment" },
          spec: {
            replicas: 2
          }
        },
        {
          apiVersion: "v1",
          kind: "Service",
          metadata: { name: "test-service" },
          spec: {
            selector: {}
          }
        }
      ];
    });

    beforeEach(execute);

    test("should generate code", () => {
      expect(code).toMatchSnapshot();
    });

    test("should export an array containing a deployment and a service", () => {
      expect(exported).toMatchSnapshot();
    });

    test("should export a Deployment instance", () => {
      expect(exported[0]).toBeInstanceOf(Deployment);
    });

    test("should export a Service instance", () => {
      expect(exported[1]).toBeInstanceOf(Service);
    });
  });

  describe("given multiple manifests of same kind", () => {
    beforeAll(() => {
      data = [
        {
          apiVersion: "v1",
          kind: "ConfigMap",
          metadata: {
            name: "config-foo"
          },
          data: {
            foo: "bar"
          }
        },
        {
          apiVersion: "v1",
          kind: "ConfigMap",
          metadata: {
            name: "config-bar"
          },
          data: {
            bar: "baz"
          }
        },
        {
          apiVersion: "v1",
          kind: "ConfigMap",
          metadata: {
            name: "config-baz"
          },
          data: {
            baz: "boo"
          }
        }
      ];
    });

    beforeEach(execute);

    test("should generate code", () => {
      expect(code).toMatchSnapshot();
    });

    test("should export an array containing three config maps", () => {
      expect(exported).toMatchSnapshot();
    });

    test("should export ConfigMap instances", () => {
      expect(exported).toSatisfyAll((x) => x instanceof ConfigMap);
    });
  });

  describe("given a List", () => {
    beforeAll(() => {
      data = [
        {
          apiVersion: "v1",
          kind: "List",
          items: [
            {
              apiVersion: "apps/v1",
              kind: "Deployment",
              metadata: { name: "test-deployment" },
              spec: {
                replicas: 2
              }
            },
            {
              apiVersion: "v1",
              kind: "Service",
              metadata: { name: "test-service" },
              spec: {
                selector: {}
              }
            }
          ]
        }
      ];
    });

    beforeEach(execute);

    test("should generate code", () => {
      expect(code).toMatchSnapshot();
    });

    test("should export an array containing items in the list", () => {
      expect(exported).toMatchSnapshot();
    });

    test("should export a Deployment instance", () => {
      expect(exported[0]).toBeInstanceOf(Deployment);
    });

    test("should export a Service instance", () => {
      expect(exported[1]).toBeInstanceOf(Service);
    });
  });

  describe("given a RBAC ClusterRoleBinding", () => {
    beforeAll(() => {
      data = [
        {
          apiVersion: "rbac.authorization.k8s.io/v1",
          kind: "ClusterRoleBinding",
          metadata: {
            name: "tiller"
          }
        }
      ];
    });

    beforeEach(execute);

    test("should generate code", () => {
      expect(code).toMatchSnapshot();
    });

    test("should export an array containing a ClusterRoleBinding", () => {
      expect(exported).toMatchSnapshot();
    });

    test("should export a ClusterRoleBinding instance", () => {
      expect(exported[0]).toBeInstanceOf(ClusterRoleBinding);
    });
  });

  describe("given a CRD", () => {
    beforeAll(() => {
      data = [
        {
          apiVersion: "networking.istio.io/v1alpha3",
          kind: "VirtualService",
          metadata: { name: "details" }
        }
      ];
    });

    beforeEach(execute);

    test("should generate code", () => {
      expect(code).toMatchSnapshot();
    });

    test("should export an array containing a CRD", () => {
      expect(exported).toMatchSnapshot();
    });

    test("should export a plain object", () => {
      expect(exported).toSatisfyAll(isPlainObject);
    });
  });

  describe("when format = ESM", () => {
    test("should generate code in ESM format", async () => {
      await expect(
        migrate(
          [
            {
              apiVersion: "v1",
              kind: "Pod",
              metadata: { name: "test-pod" },
              spec: {
                containers: []
              }
            }
          ],
          { format: MigrateFormat.ESM }
        )
      ).resolves.toMatchSnapshot();
    });
  });
});

describe("migrateString", () => {
  describe("given valid YAML", () => {
    test("should generate code", async () => {
      await expect(
        migrateString(`---
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  containers: []
`)
      ).resolves.toMatchSnapshot();
    });
  });

  describe("given empty objects in YAML", () => {
    test("should ignore them", async () => {
      await expect(
        migrateString(`---
---
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
---
---
`)
      ).resolves.toMatchSnapshot();
    });
  });

  describe("given valid JSON", () => {
    test("should generate code", async () => {
      await expect(
        migrateString(`{
"apiVersion": "v1",
"kind": "Pod",
"metadata": {
  "name": "test-pod"
},
"spec": {
  "containers": []
}
      }`)
      ).resolves.toMatchSnapshot();
    });
  });

  describe("when format = ESM", () => {
    test("should generate code in ESM format", async () => {
      await expect(
        migrateString(
          `---
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  containers: []
`,
          { format: MigrateFormat.ESM }
        )
      ).resolves.toMatchSnapshot();
    });
  });
});
