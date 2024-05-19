/// <reference types="jest-extended" />
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

describe("when requests config is specified", () => {
  test("should pass when all requests are defined", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "foo" },
        spec: {
          containers: [
            {
              name: "foo",
              resources: { requests: { cpu: "100m", memory: "100Mi" } }
            }
          ]
        }
      })
    );
    expect(
      validate(rule, { requests: ["cpu", "memory"] }, manifest)
    ).toBeEmpty();
  });

  test("should report when some requests are missing", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "foo" },
        spec: {
          containers: [
            {
              name: "foo",
              resources: { requests: { cpu: "100m" } }
            }
          ]
        }
      })
    );
    expect(validate(rule, { requests: ["cpu", "memory"] }, manifest)).toEqual([
      { manifest, message: `Container "foo" must define requests for: memory.` }
    ]);
  });

  test("should report when requests is an empty object", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "foo" },
        spec: {
          containers: [{ name: "foo", resources: { requests: {} } }]
        }
      })
    );
    expect(validate(rule, { requests: ["cpu", "memory"] }, manifest)).toEqual([
      {
        manifest,
        message: `Container "foo" must define requests for: cpu, memory.`
      }
    ]);
  });

  test("should report when requests is undefined", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "foo" },
        spec: {
          containers: [{ name: "foo", resources: {} }]
        }
      })
    );
    expect(validate(rule, { requests: ["cpu", "memory"] }, manifest)).toEqual([
      {
        manifest,
        message: `Container "foo" must define requests for: cpu, memory.`
      }
    ]);
  });
});

describe("when limits are defined", () => {
  test("should pass when all limits are defined", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "foo" },
        spec: {
          containers: [
            {
              name: "foo",
              resources: { limits: { cpu: "100m", memory: "100Mi" } }
            }
          ]
        }
      })
    );
    expect(validate(rule, { limits: ["cpu", "memory"] }, manifest)).toBeEmpty();
  });

  test("should report when some limits are missing", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "foo" },
        spec: {
          containers: [
            {
              name: "foo",
              resources: { limits: { cpu: "100m" } }
            }
          ]
        }
      })
    );
    expect(validate(rule, { limits: ["cpu", "memory"] }, manifest)).toEqual([
      { manifest, message: `Container "foo" must define limits for: memory.` }
    ]);
  });

  test("should report when limits is an empty object", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "foo" },
        spec: {
          containers: [{ name: "foo", resources: { limits: {} } }]
        }
      })
    );
    expect(validate(rule, { limits: ["cpu", "memory"] }, manifest)).toEqual([
      {
        manifest,
        message: `Container "foo" must define limits for: cpu, memory.`
      }
    ]);
  });

  test("should report when limits is undefined", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "foo" },
        spec: {
          containers: [{ name: "foo", resources: {} }]
        }
      })
    );
    expect(validate(rule, { limits: ["cpu", "memory"] }, manifest)).toEqual([
      {
        manifest,
        message: `Container "foo" must define limits for: cpu, memory.`
      }
    ]);
  });
});
