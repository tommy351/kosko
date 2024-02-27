import { createManifest, validate } from "../test-utils";
import rule from "./no-missing-pod-volume-mount";
import { Pod } from "kubernetes-models/v1/Pod";
import { Deployment } from "kubernetes-models/apps/v1/Deployment";
import { StatefulSet } from "kubernetes-models/apps/v1/StatefulSet";

test("should pass when containers is empty", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: []
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when containers is undefined", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      // @ts-expect-error
      spec: {}
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should report when volumeMounts is defined but volumes is empty", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [
          {
            name: "test",
            image: "test",
            volumeMounts: [{ name: "foo", mountPath: "/test" }]
          }
        ]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Volume "foo" is not defined in volumes.`
    }
  ]);
});

test("should report when volumeMounts is defined but volumes does not contain the volume", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [
          {
            name: "test",
            image: "test",
            volumeMounts: [{ name: "foo", mountPath: "/test" }]
          }
        ],
        volumes: [{ name: "bar" }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Volume "foo" is not defined in volumes.`
    }
  ]);
});

test("should support multiple containers", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [
          {
            name: "test",
            image: "test",
            volumeMounts: [{ name: "foo", mountPath: "/test" }]
          },
          {
            name: "test2",
            image: "test",
            volumeMounts: [{ name: "bar", mountPath: "/test" }]
          }
        ],
        volumes: [{ name: "foo" }]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Volume "bar" is not defined in volumes.`
    }
  ]);
});

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

test("should validate Pod-like objects", () => {
  const manifest = createManifest({
    apiVersion: "v1",
    kind: "Pod",
    metadata: { name: "test" },
    spec: {
      containers: [
        {
          name: "test",
          image: "test",
          volumeMounts: [{ name: "foo", mountPath: "/test" }]
        }
      ]
    }
  });

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Volume "foo" is not defined in volumes.`
    }
  ]);
});

test("should validate Deployment", () => {
  const manifest = createManifest(
    new Deployment({
      metadata: { name: "test" },
      spec: {
        selector: {},
        template: {
          spec: {
            containers: [
              {
                name: "test",
                image: "test",
                volumeMounts: [{ name: "foo", mountPath: "/test" }]
              }
            ]
          }
        }
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Volume "foo" is not defined in volumes.`
    }
  ]);
});

describe("StatefulSet", () => {
  test("should pass when volumeClaimTemplates includes the volume name", () => {
    const manifest = createManifest(
      new StatefulSet({
        metadata: { name: "test" },
        spec: {
          selector: {},
          serviceName: "test",
          template: {
            spec: {
              containers: [
                {
                  name: "test",
                  image: "test",
                  volumeMounts: [{ name: "foo", mountPath: "/test" }]
                }
              ]
            }
          },
          volumeClaimTemplates: [{ metadata: { name: "foo" } }]
        }
      })
    );

    expect(validate(rule, undefined, manifest)).toBeEmpty();
  });
});
