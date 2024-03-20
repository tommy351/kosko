/// <reference types="jest-extended" />
import { HorizontalPodAutoscaler } from "kubernetes-models/autoscaling/v1/HorizontalPodAutoscaler";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { createManifest, validateAll } from "../test-utils";
import rule from "./no-missing-scale-target";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when spec.scaleTargetRef is undefined", () => {
  const manifest = createManifest(
    new HorizontalPodAutoscaler({
      metadata: { name: "test" },
      // @ts-expect-error
      spec: {}
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when scale target exists in the same namespace", () => {
  const deployment = createManifest(
    new Deployment({
      metadata: { name: "foo", namespace: "a" }
    })
  );
  const hpa = createManifest(
    new HorizontalPodAutoscaler({
      metadata: { name: "test", namespace: "a" },
      spec: {
        maxReplicas: 1,
        scaleTargetRef: {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "foo"
        }
      }
    })
  );
  expect(validateAll(rule, undefined, [deployment, hpa])).toBeEmpty();
});

test("should report when scale target does not exist in the same namespace", () => {
  const deployment = createManifest(
    new Deployment({
      metadata: { name: "foo", namespace: "a" }
    })
  );
  const hpa = createManifest(
    new HorizontalPodAutoscaler({
      metadata: { name: "test", namespace: "b" },
      spec: {
        maxReplicas: 1,
        scaleTargetRef: {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "foo"
        }
      }
    })
  );
  expect(validateAll(rule, undefined, [deployment, hpa])).toEqual([
    {
      manifest: hpa,
      message: `Scale target "apps/v1 Deployment foo" does not exist in namespace "b".`
    }
  ]);
});

test("should report when scale target does not exist", () => {
  const manifest = createManifest(
    new HorizontalPodAutoscaler({
      metadata: { name: "test" },
      spec: {
        maxReplicas: 1,
        scaleTargetRef: {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "foo"
        }
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest,
      message: `Scale target "apps/v1 Deployment foo" does not exist.`
    }
  ]);
});

test("should pass when scale target is in the allow list", () => {
  const hpa = createManifest(
    new HorizontalPodAutoscaler({
      metadata: { name: "test", namespace: "xyz" },
      spec: {
        maxReplicas: 1,
        scaleTargetRef: {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "abc"
        }
      }
    })
  );
  expect(
    validateAll(
      rule,
      {
        allow: [
          {
            apiVersion: "apps/v1",
            kind: "Deployment",
            name: "a*",
            namespace: "x*"
          }
        ]
      },
      [hpa]
    )
  ).toBeEmpty();
});
