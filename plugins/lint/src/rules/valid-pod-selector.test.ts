import rule from "./valid-pod-selector";
import { createManifest, validate } from "../test-utils";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";

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

test("should pass when spec is undefined", () => {
  const manifest = createManifest(
    new Deployment({
      metadata: { name: "test" }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when selector is undefined", () => {
  const manifest = createManifest(
    new Deployment({
      // @ts-expect-error
      spec: {
        template: {}
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when selector.matchLabels is undefined", () => {
  const manifest = createManifest(
    new Deployment({
      spec: {
        selector: { matchExpressions: [] },
        template: {}
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should report when selector.matchLabels is an empty object", () => {
  const manifest = createManifest(
    new Deployment({
      spec: {
        selector: { matchLabels: {} },
        template: {}
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: "Pod selector must not be empty"
    }
  ]);
});

test("should report when selector does not match template labels", () => {
  const manifest = createManifest(
    new Deployment({
      spec: {
        selector: { matchLabels: { foo: "bar" } },
        template: {
          metadata: { labels: { bar: "foo" } }
        }
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: "Pod selector must match template labels"
    }
  ]);
});

test("should pass when selector matches template labels", () => {
  const manifest = createManifest(
    new Deployment({
      spec: {
        selector: { matchLabels: { foo: "bar" } },
        template: {
          metadata: { labels: { foo: "bar" } }
        }
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});
