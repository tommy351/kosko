import { Pod } from "kubernetes-models/v1/Pod";
import { createManifest, validate } from "../test-utils";
import rule from "./require-image-tag";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);
  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when image is undefined", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [{ name: "foo" }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when image has a tag", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [{ name: "foo", image: "nginx:latest" }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should report when image does not have a tag", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [{ name: "foo", image: "nginx" }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Image in container "foo" must use a tag`
    }
  ]);
});

test("should report when initContainer image does not have a tag", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        initContainers: [{ name: "foo", image: "nginx" }],
        containers: []
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Image in container "foo" must use a tag`
    }
  ]);
});

test("should report when ephemeralContainer image does not have a tag", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        ephemeralContainers: [{ name: "foo", image: "nginx" }],
        containers: []
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Image in container "foo" must use a tag`
    }
  ]);
});
