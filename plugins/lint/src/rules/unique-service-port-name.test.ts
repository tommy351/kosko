import { createManifest, validate } from "../test-utils";
import rule from "./unique-service-port-name";
import { Service } from "kubernetes-models/v1/Service";

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

test("should pass when ports is undefined", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "test" },
      spec: {}
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when ports is an empty array", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "test" },
      spec: { ports: [] }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should report when service contains multiple ports with the same name", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "test" },
      spec: {
        ports: [
          { name: "test", port: 80 },
          { name: "test", port: 81 }
        ]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Service contains multiple ports with the same name "test"`
    }
  ]);
});

test("should pass when service contains multiple ports with different names", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "test" },
      spec: {
        ports: [
          { name: "foo", port: 80 },
          { name: "bar", port: 81 }
        ]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when port name is undefined", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "test" },
      spec: {
        ports: [{ port: 80 }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});
