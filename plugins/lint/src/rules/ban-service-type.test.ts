import { Service } from "kubernetes-models/v1/Service";
import { createManifest, validate } from "../test-utils";
import rule from "./ban-service-type";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);
  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when config is undefined", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "foo" },
      spec: { type: "ClusterIP" }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when config is an empty object", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "foo" },
      spec: { type: "ClusterIP" }
    })
  );

  expect(validate(rule, {}, manifest)).toBeEmpty();
});

test("should pass when spec is undefined", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "foo" }
    })
  );

  expect(validate(rule, { types: ["LoadBalancer"] }, manifest)).toBeEmpty();
});

test("should pass when type is undefined", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "foo" },
      spec: {}
    })
  );

  expect(validate(rule, { types: ["LoadBalancer"] }, manifest)).toBeEmpty();
});

test("should pass when type is an empty string", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "foo" },
      spec: {
        // @ts-expect-error
        type: ""
      }
    })
  );

  expect(validate(rule, { types: ["LoadBalancer"] }, manifest)).toBeEmpty();
});

test("should report when type is banned", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "foo" },
      spec: { type: "LoadBalancer" }
    })
  );

  expect(validate(rule, { types: ["LoadBalancer"] }, manifest)).toEqual([
    {
      manifest,
      message: `Service type "LoadBalancer" is banned.`
    }
  ]);
});

test("should pass when type is not banned", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "foo" },
      spec: { type: "ClusterIP" }
    })
  );

  expect(validate(rule, { types: ["LoadBalancer"] }, manifest)).toBeEmpty();
});
