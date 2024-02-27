import { Pod } from "kubernetes-models/v1/Pod";
import { createManifest, validate } from "../test-utils";
import rule from "./unique-container-name";

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
    new Pod({
      metadata: { name: "test" }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should report when pod contains multiple containers with the same name", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [{ name: "test" }, { name: "test" }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Pod contains multiple containers with the same name "test"`
    }
  ]);
});

test("should pass when pod contains multiple containers with different names", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [{ name: "foo" }, { name: "bar" }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when pod contains no containers", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      // @ts-expect-error
      spec: {}
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should report when container and initContainer have the same name", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [{ name: "test" }],
        initContainers: [{ name: "test" }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Pod contains multiple containers with the same name "test"`
    }
  ]);
});

test("should pass when container and initContainer have different names", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [{ name: "foo" }],
        initContainers: [{ name: "bar" }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should report when container and ephemeralContainer have the same name", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [{ name: "test" }],
        ephemeralContainers: [{ name: "test" }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Pod contains multiple containers with the same name "test"`
    }
  ]);
});

test("should pass when container and ephemeralContainer have different names", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [{ name: "foo" }],
        ephemeralContainers: [{ name: "bar" }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when container name is undefined", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        // @ts-expect-error
        containers: [{}]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});
