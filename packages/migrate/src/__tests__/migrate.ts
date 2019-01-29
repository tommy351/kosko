import { migrate, migrateString, Manifest } from "../migrate";
import { YAMLException } from "js-yaml";
import { runInThisContext } from "vm";
import Module from "module";

describe("migrate", () => {
  let data: ReadonlyArray<Manifest>;
  let code: string;
  let exported: any;

  function execute() {
    code = migrate(data);

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

    test("should export value", () => {
      expect(exported).toMatchSnapshot();
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

    test("should export value", () => {
      expect(exported).toMatchSnapshot();
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

    test("should export value", () => {
      expect(exported).toMatchSnapshot();
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
        }
      ];
    });

    beforeEach(execute);

    test("should generate code", () => {
      expect(code).toMatchSnapshot();
    });

    test("should export value", () => {
      expect(exported).toMatchSnapshot();
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

    test("should generate code", () => {
      expect(code).toMatchSnapshot();
    });

    test("should export value", () => {
      expect(exported).toMatchSnapshot();
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

    test("should export value", () => {
      expect(exported).toMatchSnapshot();
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

    test("should export value", () => {
      expect(exported).toMatchSnapshot();
    });
  });

  describe("when apiVersion does not exist", () => {
    test("should throw an error", () => {
      expect(() => migrate([{} as any])).toThrowError(
        "apiVersion and kind is required"
      );
    });
  });

  describe("when kind does not exist", () => {
    test("should throw an error", () => {
      expect(() => migrate([{} as any])).toThrowError(
        "apiVersion and kind is required"
      );
    });
  });
});

describe("migrateString", () => {
  describe("given valid YAML", () => {
    test("should generate code", () => {
      expect(
        migrateString(`---
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  containers: []
`)
      ).toMatchSnapshot();
    });
  });

  describe("given valid JSON", () => {
    test("should generate code", () => {
      expect(
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
      ).toMatchSnapshot();
    });
  });

  describe("given invalid YAML", () => {
    test("should throw an error", () => {
      expect(() => migrateString("{")).toThrow(YAMLException);
    });
  });
});
