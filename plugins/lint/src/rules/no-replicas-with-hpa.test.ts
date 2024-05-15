/// <reference types="jest-extended" />
import rule from "./no-replicas-with-hpa";
import { createManifest, validateAll } from "../test-utils";
import { HorizontalPodAutoscaler } from "kubernetes-models/autoscaling/v1/HorizontalPodAutoscaler";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";

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
      metadata: { name: "foo", namespace: "a" },
      // @ts-expect-error
      spec: {}
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when spec.scaleTargetRef.name is undefined", () => {
  const manifest = createManifest(
    new HorizontalPodAutoscaler({
      metadata: { name: "foo", namespace: "a" },
      spec: {
        // @ts-expect-error
        scaleTargetRef: {
          apiVersion: "apps/v1",
          kind: "Deployment"
        },
        maxReplicas: 1
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when spec.scaleTargetRef.kind is undefined", () => {
  const manifest = createManifest(
    new HorizontalPodAutoscaler({
      metadata: { name: "foo", namespace: "a" },
      spec: {
        // @ts-expect-error
        scaleTargetRef: {
          apiVersion: "apps/v1",
          name: "bar"
        },
        maxReplicas: 1
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when spec.scaleTargetRef.apiVersion is undefined", () => {
  const manifest = createManifest(
    new HorizontalPodAutoscaler({
      metadata: { name: "foo", namespace: "a" },
      spec: {
        scaleTargetRef: {
          kind: "Deployment",
          name: "bar"
        },
        maxReplicas: 1
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should fail when replicas is defined", () => {
  const hpa = createManifest(
    new HorizontalPodAutoscaler({
      metadata: { name: "foo", namespace: "a" },
      spec: {
        scaleTargetRef: {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "bar"
        },
        maxReplicas: 1
      }
    })
  );
  const deployment = createManifest(
    new Deployment({
      metadata: { name: "bar", namespace: "a" },
      spec: {
        replicas: 3,
        selector: {},
        template: {}
      }
    })
  );
  expect(validateAll(rule, undefined, [hpa, deployment])).toEqual([
    {
      manifest: deployment,
      message: "Replicas should be removed because it is managed by HPA."
    }
  ]);
});

test("should pass when replicas is not defined", () => {
  const hpa = createManifest(
    new HorizontalPodAutoscaler({
      metadata: { name: "foo", namespace: "a" },
      spec: {
        scaleTargetRef: {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "bar"
        },
        maxReplicas: 1
      }
    })
  );
  const deployment = createManifest(
    new Deployment({
      metadata: { name: "bar", namespace: "a" }
    })
  );
  expect(validateAll(rule, undefined, [hpa, deployment])).toBeEmpty();
});

test("should pass when target does not exist", () => {
  const hpa = createManifest(
    new HorizontalPodAutoscaler({
      metadata: { name: "foo", namespace: "a" },
      spec: {
        scaleTargetRef: {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "bar"
        },
        maxReplicas: 1
      }
    })
  );
  expect(validateAll(rule, undefined, [hpa])).toBeEmpty();
});

test("should pass when target is in another namespace", () => {
  const hpa = createManifest(
    new HorizontalPodAutoscaler({
      metadata: { name: "foo", namespace: "a" },
      spec: {
        scaleTargetRef: {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "bar"
        },
        maxReplicas: 1
      }
    })
  );
  const deployment = createManifest(
    new Deployment({
      metadata: { name: "bar", namespace: "b" },
      spec: {
        replicas: 3,
        selector: {},
        template: {}
      }
    })
  );
  expect(validateAll(rule, undefined, [hpa, deployment])).toBeEmpty();
});

test("should pass when target is allowed", () => {
  const hpa = createManifest(
    new HorizontalPodAutoscaler({
      metadata: { name: "foo", namespace: "a" },
      spec: {
        scaleTargetRef: {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "bar"
        },
        maxReplicas: 1
      }
    })
  );
  const deployment = createManifest(
    new Deployment({
      metadata: { name: "bar", namespace: "a" },
      spec: {
        selector: {},
        template: {}
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
            name: "bar",
            namespace: "a"
          }
        ]
      },
      [hpa, deployment]
    )
  ).toBeEmpty();
});

test("should pass when HPA is not defined", () => {
  const deployment = createManifest(
    new Deployment({
      metadata: { name: "bar", namespace: "a" },
      spec: {
        replicas: 3,
        selector: {},
        template: {}
      }
    })
  );
  expect(validateAll(rule, undefined, [deployment])).toBeEmpty();
});
