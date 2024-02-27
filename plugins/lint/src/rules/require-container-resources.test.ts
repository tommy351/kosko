import { Pod } from "kubernetes-models/v1/Pod";
import { createManifest, validate } from "../test-utils";
import rule from "./require-container-resources";
import { Manifest } from "./types";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);
  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when containers is an empty array", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: { containers: [] }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should report when resources is undefined", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [{ name: "foo" }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    { manifest, message: `Container "foo" must define resources.` }
  ]);
});

test("should pass when resources is defined", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [{ name: "foo", resources: {} }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

describe("when initContainer resources is not defined", () => {
  let manifest: Manifest;

  beforeEach(() => {
    manifest = createManifest(
      new Pod({
        metadata: { name: "foo" },
        spec: {
          initContainers: [{ name: "foo" }],
          containers: []
        }
      })
    );
  });

  test("should pass by default", () => {
    expect(validate(rule, undefined, manifest)).toBeEmpty();
  });

  test("should report when init is true", () => {
    expect(validate(rule, { init: true }, manifest)).toEqual([
      { manifest, message: `Container "foo" must define resources.` }
    ]);
  });
});

describe("when ephemeralContainer resources is not defined", () => {
  let manifest: Manifest;

  beforeEach(() => {
    manifest = createManifest(
      new Pod({
        metadata: { name: "foo" },
        spec: {
          ephemeralContainers: [{ name: "foo" }],
          containers: []
        }
      })
    );
  });

  test("should pass by default", () => {
    expect(validate(rule, undefined, manifest)).toBeEmpty();
  });

  test("should report when ephemeral is true", () => {
    expect(validate(rule, { ephemeral: true }, manifest)).toEqual([
      { manifest, message: `Container "foo" must define resources.` }
    ]);
  });
});
