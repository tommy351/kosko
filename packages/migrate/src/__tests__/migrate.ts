/// <reference types="jest-extended"/>
import { migrate, migrateString } from "../migrate";
import { YAMLException } from "js-yaml";

describe("migrate", () => {
  describe("given no manifests", () => {
    test("should match snapshot", () => {
      expect(migrate([])).toMatchSnapshot();
    });
  });

  describe("given single manifest", () => {
    test("should match snapshot", () => {
      expect(
        migrate([
          {
            apiVersion: "v1",
            kind: "Pod",
            metadata: { name: "test-pod" },
            spec: {
              containers: []
            }
          }
        ])
      ).toMatchSnapshot();
    });
  });

  describe("given multiple manifests of different kinds", () => {
    test("should match snapshot", () => {
      expect(
        migrate([
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
        ])
      ).toMatchSnapshot();
    });
  });

  describe("given multiple manifests of same kind", () => {
    let result: string;

    beforeEach(() => {
      result = migrate([
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
      ]);
    });

    test("should match snapshot", () => {
      expect(result).toMatchSnapshot();
    });

    test("should not have duplicated names", () => {
      expect(result).toIncludeRepeated("const configMap = new ConfigMap", 1);
    });

    test("should rename the second config map", () => {
      expect(result).toInclude("const configMap1 = new ConfigMap");
    });
  });

  describe("given a List", () => {
    test("should match snapshot", () => {
      expect(
        migrate([
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
        ])
      ).toMatchSnapshot();
    });
  });

  describe("given a RBAC ClusterRoleBinding", () => {
    test("should match snapshot", () => {
      expect(
        migrate([
          {
            apiVersion: "rbac.authorization.k8s.io/v1",
            kind: "ClusterRoleBinding",
            metadata: {
              name: "tiller"
            }
          }
        ])
      ).toMatchSnapshot();
    });
  });

  describe("given a CRD", () => {
    test("should match snapshot", () => {
      expect(
        migrate([
          {
            apiVersion: "networking.istio.io/v1alpha3",
            kind: "VirtualService",
            metadata: { name: "details" }
          }
        ])
      ).toMatchSnapshot();
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
    test("should match snapshot", () => {
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
    test("should match snapshot", () => {
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
