/// <reference types="jest-extended" />
import { Service } from "kubernetes-models/v1/Service";
import { createManifest, validateAll } from "../test-utils";
import rule from "./no-missing-service";
import { Ingress } from "kubernetes-models/networking.k8s.io/v1";
import { StatefulSet } from "kubernetes-models/apps/v1";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when service is in the same namespace", () => {
  const service = createManifest(
    new Service({
      metadata: { name: "foo", namespace: "a" }
    })
  );
  const ingress = createManifest(
    new Ingress({
      metadata: { name: "bar", namespace: "a" },
      spec: {
        defaultBackend: { service: { name: "foo" } }
      }
    })
  );
  expect(validateAll(rule, undefined, [service, ingress])).toBeEmpty();
});

test("should report when service is not in the same namespace", () => {
  const service = createManifest(
    new Service({
      metadata: { name: "foo", namespace: "a" }
    })
  );
  const ingress = createManifest(
    new Ingress({
      metadata: { name: "bar", namespace: "b" },
      spec: {
        defaultBackend: { service: { name: "foo" } }
      }
    })
  );
  expect(validateAll(rule, undefined, [service, ingress])).toEqual([
    {
      manifest: ingress,
      message: `Service "foo" does not exist in namespace "b".`
    }
  ]);
});

test("should pass when service is in the allow list", () => {
  const ingress = createManifest(
    new Ingress({
      metadata: { name: "bar", namespace: "a" },
      spec: {
        defaultBackend: { service: { name: "foo" } }
      }
    })
  );
  expect(
    validateAll(rule, { allow: [{ name: "foo", namespace: "a" }] }, [ingress])
  ).toBeEmpty();
});

test("should check StatefulSet", () => {
  const manifest = createManifest(
    new StatefulSet({
      metadata: { name: "foo" },
      spec: {
        serviceName: "bar",
        selector: {},
        template: {}
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest,
      message: `Service "bar" does not exist.`
    }
  ]);
});

test("should check http path rule in ingress", () => {
  const manifest = createManifest(
    new Ingress({
      metadata: { name: "foo" },
      spec: {
        rules: [
          {
            http: {
              paths: [
                { pathType: "Exact", backend: { service: { name: "bar" } } }
              ]
            }
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest,
      message: `Service "bar" does not exist.`
    }
  ]);
});
