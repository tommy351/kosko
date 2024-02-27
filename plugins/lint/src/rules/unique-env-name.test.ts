import { Pod } from "kubernetes-models/v1/Pod";
import { createManifest, validate } from "../test-utils";
import rule from "./unique-env-name";

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

test("should pass when env is an empty array", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [{ name: "test", env: [] }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when env is undefined", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [{ name: "test" }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when env names are unique", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [{ name: "test", env: [{ name: "foo" }, { name: "bar" }] }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should report when env names are not unique", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [
          {
            name: "test",
            env: [{ name: "foo" }, { name: "bar" }, { name: "foo" }]
          }
        ]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Container "test" contains multiple environment variables with the same name "foo"`
    }
  ]);
});

test("should pass when env names are not unique across containers", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [
          {
            name: "foo",
            env: [{ name: "foo" }]
          },
          {
            name: "bar",
            env: [{ name: "foo" }]
          }
        ]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should report when initContainer env names are not unique", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        initContainers: [
          {
            name: "test",
            env: [{ name: "foo" }, { name: "bar" }, { name: "foo" }]
          }
        ],
        containers: []
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Container "test" contains multiple environment variables with the same name "foo"`
    }
  ]);
});

test("should report when ephemeralContainer env names are not unique", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        ephemeralContainers: [
          {
            name: "test",
            env: [{ name: "foo" }, { name: "bar" }, { name: "foo" }]
          }
        ],
        containers: []
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Container "test" contains multiple environment variables with the same name "foo"`
    }
  ]);
});
