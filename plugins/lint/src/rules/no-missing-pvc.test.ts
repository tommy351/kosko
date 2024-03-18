/// <reference types="jest-extended" />
import { Pod } from "kubernetes-models/v1/Pod";
import { createManifest, validateAll } from "../test-utils";
import rule from "./no-missing-pvc";
import { PersistentVolumeClaim } from "kubernetes-models/v1/PersistentVolumeClaim";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when volume is not a PVC", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [],
        volumes: [{ name: "foo", emptyDir: {} }]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should report when volume does not exist", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [],
        volumes: [{ name: "foo", persistentVolumeClaim: { claimName: "bar" } }]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest,
      message: `Persistent volume claim "bar" does not exist.`
    }
  ]);
});

test("should pass when volume exists in the same namespace", () => {
  const pvc = createManifest(
    new PersistentVolumeClaim({
      metadata: { name: "foo", namespace: "a" },
      spec: {}
    })
  );
  const pod = createManifest(
    new Pod({
      metadata: { name: "test", namespace: "a" },
      spec: {
        containers: [],
        volumes: [{ name: "abc", persistentVolumeClaim: { claimName: "foo" } }]
      }
    })
  );
  expect(validateAll(rule, undefined, [pvc, pod])).toBeEmpty();
});

test("should report when volume does not exist in the same namespace", () => {
  const pvc = createManifest(
    new PersistentVolumeClaim({
      metadata: { name: "foo", namespace: "a" },
      spec: {}
    })
  );
  const pod = createManifest(
    new Pod({
      metadata: { name: "test", namespace: "b" },
      spec: {
        containers: [],
        volumes: [{ name: "abc", persistentVolumeClaim: { claimName: "foo" } }]
      }
    })
  );
  expect(validateAll(rule, undefined, [pvc, pod])).toEqual([
    {
      manifest: pod,
      message: `Persistent volume claim "foo" does not exist in namespace "b".`
    }
  ]);
});

test("should pass when PVC is in the allow list", () => {
  const pod = createManifest(
    new Pod({
      metadata: { name: "test", namespace: "abc" },
      spec: {
        containers: [],
        volumes: [{ name: "abc", persistentVolumeClaim: { claimName: "xyz" } }]
      }
    })
  );
  expect(
    validateAll(rule, { allow: [{ namespace: "a*", name: "x*" }] }, [pod])
  ).toBeEmpty();
});
