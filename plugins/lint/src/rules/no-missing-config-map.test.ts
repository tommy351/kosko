/// <reference types="jest-extended" />
import { createManifest, validateAll } from "../test-utils";
import rule from "./no-missing-config-map";
import { ConfigMap } from "kubernetes-models/v1/ConfigMap";
import { Pod } from "kubernetes-models/v1/Pod";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when config map is in the same namespace", () => {
  const configMap = createManifest(
    new ConfigMap({
      metadata: { name: "foo", namespace: "a" }
    })
  );
  const pod = createManifest(
    new Pod({
      metadata: { name: "bar", namespace: "a" },
      spec: {
        containers: [],
        volumes: [{ name: "abc", configMap: { name: "foo" } }]
      }
    })
  );
  expect(validateAll(rule, undefined, [configMap, pod])).toBeEmpty();
});

test("should report when config map does not exist in the same namespace", () => {
  const configMap = createManifest(
    new ConfigMap({
      metadata: { name: "foo", namespace: "a" }
    })
  );
  const pod = createManifest(
    new Pod({
      metadata: { name: "bar", namespace: "b" },
      spec: {
        containers: [],
        volumes: [{ name: "abc", configMap: { name: "foo" } }]
      }
    })
  );
  expect(validateAll(rule, undefined, [configMap, pod])).toEqual([
    {
      manifest: pod,
      message: `Config map "foo" does not exist in namespace "b".`
    }
  ]);
});

test("should pass when config map does not exist but the volume is optional", () => {
  const pod = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [],
        volumes: [{ name: "abc", configMap: { name: "foo", optional: true } }]
      }
    })
  );
  expect(validateAll(rule, undefined, [pod])).toBeEmpty();
});

test("should report when config map in container env does not exist", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [
          {
            name: "foo",
            env: [
              {
                name: "FOO",
                valueFrom: { configMapKeyRef: { name: "foo", key: "bar" } }
              }
            ]
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    { manifest, message: `Config map "foo" does not exist.` }
  ]);
});

test("should pass when config map in container env is optional", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [
          {
            name: "foo",
            env: [
              {
                name: "FOO",
                valueFrom: {
                  configMapKeyRef: { name: "foo", key: "bar", optional: true }
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

test("should report when config map in container envFrom does not exist", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [
          {
            name: "foo",
            envFrom: [{ configMapRef: { name: "foo" } }]
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    { manifest, message: `Config map "foo" does not exist.` }
  ]);
});

test("should pass when config map in container envFrom is optional", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [
          {
            name: "foo",
            envFrom: [{ configMapRef: { name: "foo", optional: true } }]
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should report when projected config map does not exist", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [],
        volumes: [
          {
            name: "abc",
            projected: { sources: [{ configMap: { name: "foo" } }] }
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    { manifest, message: `Config map "foo" does not exist.` }
  ]);
});

test("should pass when projected config map is optional", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [],
        volumes: [
          {
            name: "abc",
            projected: {
              sources: [{ configMap: { name: "foo", optional: true } }]
            }
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when config map is allowed", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo", namespace: "abc" },
      spec: {
        containers: [],
        volumes: [{ name: "abc", configMap: { name: "xyz" } }]
      }
    })
  );
  expect(
    validateAll(rule, { allow: [{ name: "x*", namespace: "a*" }] }, [manifest])
  ).toBeEmpty();
});
