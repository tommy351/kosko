import { Service } from "kubernetes-models/v1/Service";
import { createManifest, validate } from "../test-utils";
import rule from "./require-service-selector";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);
  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should report when selector is undefined", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "foo" },
      spec: {}
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    { manifest, message: "Service selector must not be empty" }
  ]);
});

test("should report when selector is an empty object", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "foo" },
      spec: { selector: {} }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    { manifest, message: "Service selector must not be empty" }
  ]);
});

test("should pass when selector is not empty", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "foo" },
      spec: { selector: { app: "foo" } }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when service is in allow list", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "foo", namespace: "bar" },
      spec: {}
    })
  );

  expect(
    validate(rule, { allow: [{ name: "foo", namespace: "bar" }] }, manifest)
  ).toBeEmpty();
});
