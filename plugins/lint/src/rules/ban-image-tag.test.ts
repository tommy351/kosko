import { Pod } from "kubernetes-models/v1/Pod";
import { createManifest, validate } from "../test-utils";
import rule from "./ban-image-tag";

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
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [{ name: "foo", image: "nginx:latest" }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when config is an empty object", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [{ name: "foo", image: "nginx:latest" }]
      }
    })
  );

  expect(validate(rule, {}, manifest)).toBeEmpty();
});

test("should report when tag is banned", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [{ name: "foo", image: "nginx:latest" }]
      }
    })
  );

  expect(validate(rule, { tags: ["latest"] }, manifest)).toEqual([
    {
      manifest,
      message: `Image in container "foo" must not use the "latest" tag`
    }
  ]);
});

test("should pass when tag is not banned", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [{ name: "foo", image: "nginx:1.19.6" }]
      }
    })
  );

  expect(validate(rule, { tags: ["latest"] }, manifest)).toBeEmpty();
});

test("should pass when tag is not specified", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [{ name: "foo", image: "nginx" }]
      }
    })
  );

  expect(validate(rule, { tags: ["latest"] }, manifest)).toBeEmpty();
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

  expect(validate(rule, { tags: ["latest"] }, manifest)).toBeEmpty();
});

test("should report when initContainer uses banned tag", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        initContainers: [{ name: "foo", image: "nginx:latest" }],
        containers: []
      }
    })
  );

  expect(validate(rule, { tags: ["latest"] }, manifest)).toEqual([
    {
      manifest,
      message: `Image in container "foo" must not use the "latest" tag`
    }
  ]);
});

test("should report when ephemeralContainer uses banned tag", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        ephemeralContainers: [{ name: "foo", image: "nginx:latest" }],
        containers: []
      }
    })
  );

  expect(validate(rule, { tags: ["latest"] }, manifest)).toEqual([
    {
      manifest,
      message: `Image in container "foo" must not use the "latest" tag`
    }
  ]);
});
