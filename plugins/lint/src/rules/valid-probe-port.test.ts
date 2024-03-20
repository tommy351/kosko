import { Pod } from "kubernetes-models/v1";
import { createManifest, validate } from "../test-utils";
import rule from "./valid-probe-port";

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

test("should pass when probe is undefined", () => {
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

describe.each(["liveness", "readiness", "startup"] as const)(
  "when %sProbe is defined",
  (probeType) => {
    test("should pass when port name is defined", () => {
      const manifest = createManifest(
        new Pod({
          metadata: { name: "test" },
          spec: {
            containers: [
              {
                name: "test",
                ports: [{ name: "http", containerPort: 80 }],
                [`${probeType}Probe`]: {
                  httpGet: { port: "http" }
                }
              }
            ]
          }
        })
      );

      expect(validate(rule, undefined, manifest)).toBeEmpty();
    });

    test("should report when ports array is empty", () => {
      const manifest = createManifest(
        new Pod({
          metadata: { name: "test" },
          spec: {
            containers: [
              {
                name: "test",
                [`${probeType}Probe`]: {
                  httpGet: { port: "http" }
                }
              }
            ]
          }
        })
      );

      expect(validate(rule, undefined, manifest)).toEqual([
        {
          manifest,
          message: `Port "http" is not defined in container "test".`
        }
      ]);
    });

    test("should pass when port number is not defined", () => {
      const manifest = createManifest(
        new Pod({
          metadata: { name: "test" },
          spec: {
            containers: [
              {
                name: "test",
                ports: [{ containerPort: 8080 }],
                [`${probeType}Probe`]: {
                  httpGet: { port: 80 }
                }
              }
            ]
          }
        })
      );

      expect(validate(rule, undefined, manifest)).toBeEmpty();
    });

    test("should report when port name is not defined", () => {
      const manifest = createManifest(
        new Pod({
          metadata: { name: "test" },
          spec: {
            containers: [
              {
                name: "test",
                ports: [{ name: "http", containerPort: 80 }],
                [`${probeType}Probe`]: {
                  httpGet: { port: "https" }
                }
              }
            ]
          }
        })
      );

      expect(validate(rule, undefined, manifest)).toEqual([
        {
          manifest,
          message: `Port "https" is not defined in container "test".`
        }
      ]);
    });

    test("should report when port is defined in other container", () => {
      const manifest = createManifest(
        new Pod({
          metadata: { name: "test" },
          spec: {
            containers: [
              {
                name: "test",
                ports: [{ name: "http", containerPort: 80 }],
                [`${probeType}Probe`]: {
                  httpGet: { port: "https" }
                }
              },
              {
                name: "other",
                ports: [{ name: "https", containerPort: 443 }]
              }
            ]
          }
        })
      );

      expect(validate(rule, undefined, manifest)).toEqual([
        {
          manifest,
          message: `Port "https" is not defined in container "test".`
        }
      ]);
    });

    test("should report when tcpSocket port is invalid", () => {
      const manifest = createManifest(
        new Pod({
          metadata: { name: "test" },
          spec: {
            containers: [
              {
                name: "test",
                [`${probeType}Probe`]: {
                  tcpSocket: { port: "foo" }
                }
              }
            ]
          }
        })
      );

      expect(validate(rule, undefined, manifest)).toEqual([
        {
          manifest,
          message: `Port "foo" is not defined in container "test".`
        }
      ]);
    });

    test("should report when grpc port is invalid", () => {
      const manifest = createManifest(
        new Pod({
          metadata: { name: "test" },
          spec: {
            containers: [
              {
                name: "test",
                [`${probeType}Probe`]: {
                  grpc: { port: "foo" }
                }
              }
            ]
          }
        })
      );

      expect(validate(rule, undefined, manifest)).toEqual([
        {
          manifest,
          message: `Port "foo" is not defined in container "test".`
        }
      ]);
    });
  }
);
