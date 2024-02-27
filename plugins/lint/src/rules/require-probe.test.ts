/// <reference types="jest-extended" />
import { createManifest, validate } from "../test-utils";
import rule from "./require-probe";
import { Pod } from "kubernetes-models/v1/Pod";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when config is undefined", () => {
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

describe("when config.readiness is true", () => {
  test("should pass when readinessProbe is defined", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "test" },
        spec: {
          containers: [{ name: "test", readinessProbe: {} }]
        }
      })
    );

    expect(validate(rule, { readiness: true }, manifest)).toBeEmpty();
  });

  test("should report when readinessProbe is undefined", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "test" },
        spec: {
          containers: [{ name: "test" }]
        }
      })
    );

    expect(validate(rule, { readiness: true }, manifest)).toEqual([
      {
        manifest,
        message: 'Container "test" must define a readiness probe.'
      }
    ]);
  });

  test("should pass when an initContainer does not have a readinessProbe", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "test" },
        spec: {
          initContainers: [{ name: "test" }],
          containers: []
        }
      })
    );

    expect(validate(rule, { readiness: true }, manifest)).toBeEmpty();
  });

  test("should pass when an ephemeralContainer does not have a readinessProbe", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "test" },
        spec: {
          ephemeralContainers: [{ name: "test" }],
          containers: []
        }
      })
    );

    expect(validate(rule, { readiness: true }, manifest)).toBeEmpty();
  });
});

describe("when config.liveness is true", () => {
  test("should pass when livenessProbe is defined", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "test" },
        spec: {
          containers: [{ name: "test", livenessProbe: {} }]
        }
      })
    );

    expect(validate(rule, { liveness: true }, manifest)).toBeEmpty();
  });

  test("should report when livenessProbe is undefined", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "test" },
        spec: {
          containers: [{ name: "test" }]
        }
      })
    );

    expect(validate(rule, { liveness: true }, manifest)).toEqual([
      {
        manifest,
        message: 'Container "test" must define a liveness probe.'
      }
    ]);
  });

  test("should pass when an initContainer does not have a livenessProbe", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "test" },
        spec: {
          initContainers: [{ name: "test" }],
          containers: []
        }
      })
    );

    expect(validate(rule, { liveness: true }, manifest)).toBeEmpty();
  });

  test("should pass when an ephemeralContainer does not have a livenessProbe", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "test" },
        spec: {
          ephemeralContainers: [{ name: "test" }],
          containers: []
        }
      })
    );

    expect(validate(rule, { liveness: true }, manifest)).toBeEmpty();
  });
});

describe("when config.startup is true", () => {
  test("should pass when startupProbe is defined", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "test" },
        spec: {
          containers: [{ name: "test", startupProbe: {} }]
        }
      })
    );

    expect(validate(rule, { startup: true }, manifest)).toBeEmpty();
  });

  test("should report when startupProbe is undefined", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "test" },
        spec: {
          containers: [{ name: "test" }]
        }
      })
    );

    expect(validate(rule, { startup: true }, manifest)).toEqual([
      {
        manifest,
        message: 'Container "test" must define a startup probe.'
      }
    ]);
  });

  test("should pass when an initContainer does not have a startupProbe", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "test" },
        spec: {
          initContainers: [{ name: "test" }],
          containers: []
        }
      })
    );

    expect(validate(rule, { startup: true }, manifest)).toBeEmpty();
  });

  test("should pass when an ephemeralContainer does not have a startupProbe", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "test" },
        spec: {
          ephemeralContainers: [{ name: "test" }],
          containers: []
        }
      })
    );

    expect(validate(rule, { startup: true }, manifest)).toBeEmpty();
  });
});
