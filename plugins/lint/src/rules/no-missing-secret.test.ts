/// <reference types="jest-extended" />
import { Pod } from "kubernetes-models/v1/Pod";
import { Secret } from "kubernetes-models/v1/Secret";
import { ServiceAccount } from "kubernetes-models/v1/ServiceAccount";
import { Ingress } from "kubernetes-models/networking.k8s.io/v1/Ingress";
import { createManifest, validateAll } from "../test-utils";
import rule from "./no-missing-secret";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when secret is in the same namespace", () => {
  const secret = createManifest(
    new Secret({
      metadata: { name: "foo", namespace: "a" }
    })
  );
  const pod = createManifest(
    new Pod({
      metadata: { name: "bar", namespace: "a" },
      spec: {
        containers: [],
        volumes: [{ name: "abc", secret: { secretName: "foo" } }]
      }
    })
  );
  expect(validateAll(rule, undefined, [secret, pod])).toBeEmpty();
});

test("should pass when secret volume is optional", () => {
  const pod = createManifest(
    new Pod({
      metadata: { name: "bar", namespace: "a" },
      spec: {
        containers: [],
        volumes: [
          { name: "abc", secret: { secretName: "foo", optional: true } }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [pod])).toBeEmpty();
});

test("should pass when secretName is undefined", () => {
  const pod = createManifest(
    new Pod({
      metadata: { name: "bar", namespace: "a" },
      spec: {
        containers: [],
        volumes: [{ name: "abc", secret: {} }]
      }
    })
  );
  expect(validateAll(rule, undefined, [pod])).toBeEmpty();
});

test("should report when secret is not in the same namespace", () => {
  const secret = createManifest(
    new Secret({
      metadata: { name: "foo", namespace: "a" }
    })
  );
  const pod = createManifest(
    new Pod({
      metadata: { name: "bar", namespace: "b" },
      spec: {
        containers: [],
        volumes: [{ name: "abc", secret: { secretName: "foo" } }]
      }
    })
  );
  expect(validateAll(rule, undefined, [secret, pod])).toEqual([
    {
      manifest: pod,
      message: `Secret "foo" does not exist in namespace "b".`
    }
  ]);
});

test("should pass when secret is in the allow list", () => {
  const pod = createManifest(
    new Pod({
      metadata: { name: "bar", namespace: "a" },
      spec: {
        containers: [],
        volumes: [{ name: "abc", secret: { secretName: "foo" } }]
      }
    })
  );
  expect(
    validateAll(rule, { allow: [{ name: "foo", namespace: "a" }] }, [pod])
  ).toBeEmpty();
});

test("should check ingress", () => {
  const manifest = createManifest(
    new Ingress({
      metadata: { name: "bar" },
      spec: {
        tls: [{ secretName: "foo" }]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest: manifest,
      message: `Secret "foo" does not exist.`
    }
  ]);
});

test("should check imagePullSecrets in ServiceAccount", () => {
  const manifest = createManifest(
    new ServiceAccount({
      metadata: { name: "foo" },
      imagePullSecrets: [{ name: "bar" }]
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest: manifest,
      message: `Secret "bar" does not exist.`
    }
  ]);
});

test("should check secrets in ServiceAccount", () => {
  const manifest = createManifest(
    new ServiceAccount({
      metadata: { name: "foo" },
      secrets: [{ name: "bar" }]
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest: manifest,
      message: `Secret "bar" does not exist.`
    }
  ]);
});

test("should check container env", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [
          {
            name: "bar",
            env: [
              {
                name: "FOO",
                valueFrom: { secretKeyRef: { name: "foo", key: "bar" } }
              }
            ]
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest: manifest,
      message: `Secret "foo" does not exist.`
    }
  ]);
});

test("should pass when container env is optional", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [
          {
            name: "bar",
            env: [
              {
                name: "FOO",
                valueFrom: {
                  secretKeyRef: { name: "foo", key: "bar", optional: true }
                }
              }
            ]
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should check container envFrom", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [
          {
            name: "bar",
            envFrom: [{ secretRef: { name: "foo" } }]
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest: manifest,
      message: `Secret "foo" does not exist.`
    }
  ]);
});

test("should pass when container envFrom is optional", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [
          {
            name: "bar",
            envFrom: [{ secretRef: { name: "foo", optional: true } }]
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should check azureFile volume", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "bar" },
      spec: {
        containers: [],
        volumes: [
          { name: "abc", azureFile: { secretName: "foo", shareName: "test" } }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest: manifest,
      message: `Secret "foo" does not exist.`
    }
  ]);
});

test("should check cephfs volume", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "bar" },
      spec: {
        containers: [],
        volumes: [
          { name: "abc", cephfs: { secretRef: { name: "foo" }, monitors: [] } }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest: manifest,
      message: `Secret "foo" does not exist.`
    }
  ]);
});

test("should check cinder volume", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "bar" },
      spec: {
        containers: [],
        volumes: [
          { name: "abc", cinder: { secretRef: { name: "foo" }, volumeID: "" } }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest: manifest,
      message: `Secret "foo" does not exist.`
    }
  ]);
});

test("should check flexVolume volume", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "bar" },
      spec: {
        containers: [],
        volumes: [
          {
            name: "abc",
            flexVolume: { driver: "", secretRef: { name: "foo" } }
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest: manifest,
      message: `Secret "foo" does not exist.`
    }
  ]);
});

test("should check iscsi volume", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "bar" },
      spec: {
        containers: [],
        volumes: [
          {
            name: "abc",
            iscsi: {
              secretRef: { name: "foo" },
              targetPortal: "",
              iqn: "",
              lun: 0
            }
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest: manifest,
      message: `Secret "foo" does not exist.`
    }
  ]);
});

test("should check projected volume", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "bar" },
      spec: {
        containers: [],
        volumes: [
          {
            name: "abc",
            projected: { sources: [{ secret: { name: "foo" } }] }
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest: manifest,
      message: `Secret "foo" does not exist.`
    }
  ]);
});

test("should pass when projected volume is optional", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "bar" },
      spec: {
        containers: [],
        volumes: [
          {
            name: "abc",
            projected: {
              sources: [{ secret: { name: "foo", optional: true } }]
            }
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should check rbd volume", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "bar" },
      spec: {
        containers: [],
        volumes: [
          {
            name: "abc",
            rbd: { monitors: [], image: "", secretRef: { name: "foo" } }
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest: manifest,
      message: `Secret "foo" does not exist.`
    }
  ]);
});

test("should check scaleIO volume", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "bar" },
      spec: {
        containers: [],
        volumes: [
          {
            name: "abc",
            scaleIO: {
              gateway: "",
              system: "",
              secretRef: { name: "foo" }
            }
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest: manifest,
      message: `Secret "foo" does not exist.`
    }
  ]);
});

test("should check storageos volume", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "bar" },
      spec: {
        containers: [],
        volumes: [
          {
            name: "abc",
            storageos: { secretRef: { name: "foo" }, volumeName: "" }
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest: manifest,
      message: `Secret "foo" does not exist.`
    }
  ]);
});

test("should check pod imagePullSecrets", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [],
        imagePullSecrets: [{ name: "bar" }]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest,
      message: 'Secret "bar" does not exist.'
    }
  ]);
});
