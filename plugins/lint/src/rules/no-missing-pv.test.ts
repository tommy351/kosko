/// <reference types="jest-extended" />
import { PersistentVolume } from "kubernetes-models/v1/PersistentVolume";
import { PersistentVolumeClaim } from "kubernetes-models/v1/PersistentVolumeClaim";
import { createManifest, validateAll } from "../test-utils";
import rule from "./no-missing-pv";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when volumeName is undefined", () => {
  const manifest = createManifest(
    new PersistentVolumeClaim({
      metadata: { name: "test" },
      spec: {}
    })
  );

  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should report when volume does not exist", () => {
  const manifest = createManifest(
    new PersistentVolumeClaim({
      metadata: { name: "test" },
      spec: { volumeName: "foo" }
    })
  );

  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest,
      message: `Persistent volume "foo" does not exist.`
    }
  ]);
});

test("should pass when volume exists", () => {
  const pv = createManifest(
    new PersistentVolume({
      metadata: { name: "foo" },
      spec: {}
    })
  );
  const pvc = createManifest(
    new PersistentVolumeClaim({
      metadata: { name: "test" },
      spec: { volumeName: "foo" }
    })
  );
  expect(validateAll(rule, undefined, [pv, pvc])).toBeEmpty();
});

test("should report when volume does not exist in the same namespace", () => {
  const pv = createManifest(
    new PersistentVolume({
      metadata: { name: "foo", namespace: "a" },
      spec: {}
    })
  );
  const pvc = createManifest(
    new PersistentVolumeClaim({
      metadata: { name: "test", namespace: "b" },
      spec: { volumeName: "foo" }
    })
  );
  expect(validateAll(rule, undefined, [pv, pvc])).toEqual([
    {
      manifest: pvc,
      message: `Persistent volume "foo" does not exist in namespace "b".`
    }
  ]);
});

test("should pass when volume is in allow list", () => {
  const pvc = createManifest(
    new PersistentVolumeClaim({
      metadata: { name: "test", namespace: "a" },
      spec: { volumeName: "foo" }
    })
  );

  expect(
    validateAll(rule, { allow: [{ name: "foo", namespace: "a" }] }, [pvc])
  ).toBeEmpty();
});
