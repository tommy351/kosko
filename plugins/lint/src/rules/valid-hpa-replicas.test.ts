import { createManifest, validate } from "../test-utils";
import rule from "./valid-hpa-replicas";
import { HorizontalPodAutoscaler as HPAV1 } from "kubernetes-models/autoscaling/v1/HorizontalPodAutoscaler";
import { HorizontalPodAutoscaler as HPAV2Beta1 } from "kubernetes-models/autoscaling/v2beta1/HorizontalPodAutoscaler";
import { HorizontalPodAutoscaler as HPAV2Beta2 } from "kubernetes-models/autoscaling/v2beta2/HorizontalPodAutoscaler";
import { HorizontalPodAutoscaler as HPAV2 } from "kubernetes-models/autoscaling/v2/HorizontalPodAutoscaler";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when data is null", () => {
  const manifest = createManifest(null);

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should report when spec is undefined", () => {
  const manifest = createManifest(
    new HPAV2({
      metadata: { name: "test" }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    { manifest, message: "maxReplicas must be a number" }
  ]);
});

test("should report when minReplicas is less than 0", () => {
  const manifest = createManifest(
    new HPAV2({
      metadata: { name: "test" },
      spec: {
        minReplicas: -1,
        maxReplicas: 1,
        scaleTargetRef: {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "foo"
        }
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    { manifest, message: "minReplicas must be at least 0" }
  ]);
});

test("should pass when minReplicas is undefined", () => {
  const manifest = createManifest(
    new HPAV2({
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

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when minReplicas is 0", () => {
  const manifest = createManifest(
    new HPAV2({
      metadata: { name: "test" },
      spec: {
        minReplicas: 0,
        maxReplicas: 1,
        scaleTargetRef: {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "foo"
        }
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should report when maxReplicas is less than 1", () => {
  const manifest = createManifest(
    new HPAV2({
      metadata: { name: "test" },
      spec: {
        maxReplicas: 0,
        scaleTargetRef: {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "foo"
        }
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    { manifest, message: "maxReplicas must be at least 1" }
  ]);
});

test("should report when minReplicas is greater than maxReplicas", () => {
  const manifest = createManifest(
    new HPAV2({
      metadata: { name: "test" },
      spec: {
        minReplicas: 2,
        maxReplicas: 1,
        scaleTargetRef: {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "foo"
        }
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: "minReplicas must be less than or equal to maxReplicas"
    }
  ]);
});

test("should pass when minReplicas is equal to maxReplicas", () => {
  const manifest = createManifest(
    new HPAV2({
      metadata: { name: "test" },
      spec: {
        minReplicas: 1,
        maxReplicas: 1,
        scaleTargetRef: {
          apiVersion: "apps/v1",
          kind: "Deployment",
          name: "foo"
        }
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should check V1 HPA", () => {
  const manifest = createManifest(
    new HPAV1({
      metadata: { name: "test" }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: "maxReplicas must be a number"
    }
  ]);
});

test("should check V2beta1 HPA", () => {
  const manifest = createManifest(
    new HPAV2Beta1({
      metadata: { name: "test" }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: "maxReplicas must be a number"
    }
  ]);
});

test("should check V2beta2 HPA", () => {
  const manifest = createManifest(
    new HPAV2Beta2({
      metadata: { name: "test" }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: "maxReplicas must be a number"
    }
  ]);
});
