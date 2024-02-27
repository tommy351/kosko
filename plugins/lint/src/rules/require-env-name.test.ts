import { Pod } from "kubernetes-models/v1/Pod";
import { createManifest, validate } from "../test-utils";
import rule from "./require-env-name";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);
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

test("should pass when env name is defined", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [{ name: "test", env: [{ name: "foo" }] }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should report when env name is undefined", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [
          {
            name: "test",
            env: [
              // @ts-expect-error
              {}
            ]
          }
        ]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Container "test" contains an environment variable without a name.`
    }
  ]);
});

test("should report when env name is empty", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [{ name: "test", env: [{ name: "" }] }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Container "test" contains an environment variable without a name.`
    }
  ]);
});
