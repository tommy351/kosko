import { Service } from "kubernetes-models/v1/Service";
import { createManifest, validate } from "../test-utils";
import rule from "./require-service-port-name";
import { Manifest } from "./types";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);
  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when spec is undefined", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "foo" }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when ports is undefined", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "foo" }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when ports is an empty array", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "foo" },
      spec: { ports: [] }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

describe("when port name is undefined, but service only has one port", () => {
  let manifest: Manifest;

  beforeEach(() => {
    manifest = createManifest(
      new Service({
        metadata: { name: "foo" },
        spec: { ports: [{ port: 80 }] }
      })
    );
  });

  test("should pass by default", () => {
    expect(validate(rule, undefined, manifest)).toBeEmpty();
  });

  test("should pass when config is an empty object", () => {
    expect(validate(rule, {}, manifest)).toBeEmpty();
  });

  test("should report when always is true", () => {
    expect(validate(rule, { always: true }, manifest)).toEqual([
      {
        manifest,
        message: `Port 80 must have a name.`
      }
    ]);
  });
});

test("should pass when every port has a name", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "foo" },
      spec: {
        ports: [
          { port: 80, name: "http" },
          { port: 443, name: "https" }
        ]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should report when a port does not have a name", () => {
  const manifest = createManifest(
    new Service({
      metadata: { name: "foo" },
      spec: {
        ports: [{ port: 80, name: "http" }, { port: 443 }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Port 443 must have a name.`
    }
  ]);
});
