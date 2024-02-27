import { Pod } from "kubernetes-models/v1/Pod";
import { createManifest, validate } from "../test-utils";
import rule from "./require-container-port-name";
import type { Manifest } from "./types";

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

test("should pass when ports is undefined", () => {
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

test("should pass when ports is an empty array", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [{ name: "foo", ports: [] }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

describe("when container port name is undefined, but container only has one port", () => {
  let manifest: Manifest;

  beforeEach(() => {
    manifest = createManifest(
      new Pod({
        metadata: { name: "foo" },
        spec: {
          containers: [{ name: "foo", ports: [{ containerPort: 80 }] }]
        }
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
        message: `Container "foo" must define a name for port 80.`
      }
    ]);
  });
});

test("should report when one of container port does not have a name", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [
          {
            name: "foo",
            ports: [
              { containerPort: 80, name: "http" },
              { containerPort: 8080 }
            ]
          }
        ]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Container "foo" must define a name for port 8080.`
    }
  ]);
});

test("should report when each container has a port, and one of them does not have a name", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        containers: [
          {
            name: "foo",
            ports: [{ containerPort: 80, name: "http" }]
          },
          {
            name: "bar",
            ports: [{ containerPort: 8080 }]
          }
        ]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Container "bar" must define a name for port 8080.`
    }
  ]);
});

test("should report when initContainer port does not have a name", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        initContainers: [
          {
            name: "foo",
            ports: [{ name: "http", containerPort: 80 }, { containerPort: 81 }]
          }
        ],
        containers: []
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Container "foo" must define a name for port 81.`
    }
  ]);
});

test("should report when ephemeralContainer port does not have a name", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" },
      spec: {
        ephemeralContainers: [
          {
            name: "foo",
            ports: [{ name: "http", containerPort: 80 }, { containerPort: 81 }]
          }
        ],
        containers: []
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Container "foo" must define a name for port 81.`
    }
  ]);
});
