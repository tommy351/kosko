import { Pod } from "kubernetes-models/v1/Pod";
import { createManifest, validate } from "../test-utils";
import rule from "./ban-image";

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

test("should report when image is banned", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [{ name: "foo", image: "nginx" }]
      }
    })
  );

  expect(validate(rule, { images: ["nginx"] }, manifest)).toEqual([
    {
      manifest,
      message: `Container "foo" uses the banned image "nginx".`
    }
  ]);
});

test("should report when image matches a pattern", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [{ name: "foo", image: "nginx:latest" }]
      }
    })
  );

  expect(validate(rule, { images: ["*:latest"] }, manifest)).toEqual([
    {
      manifest,
      message: `Container "foo" uses the banned image "nginx:latest".`
    }
  ]);
});

test("should pass when image does not match any pattern", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [{ name: "foo", image: "nginx" }]
      }
    })
  );

  expect(validate(rule, { images: ["foo", "bar"] }, manifest)).toBeEmpty();
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

  expect(validate(rule, { images: ["nginx"] }, manifest)).toBeEmpty();
});

test("should pass when image is empty", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [{ name: "foo", image: "" }]
      }
    })
  );

  expect(validate(rule, { images: ["nginx"] }, manifest)).toBeEmpty();
});

test("should report when initContainer uses banned image", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        initContainers: [{ name: "foo", image: "nginx" }],
        containers: []
      }
    })
  );

  expect(validate(rule, { images: ["nginx"] }, manifest)).toEqual([
    {
      manifest,
      message: `Container "foo" uses the banned image "nginx".`
    }
  ]);
});

test("should report when ephemeralContainer uses banned tag", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        ephemeralContainers: [{ name: "foo", image: "nginx" }],
        containers: []
      }
    })
  );

  expect(validate(rule, { images: ["nginx"] }, manifest)).toEqual([
    {
      manifest,
      message: `Container "foo" uses the banned image "nginx".`
    }
  ]);
});
