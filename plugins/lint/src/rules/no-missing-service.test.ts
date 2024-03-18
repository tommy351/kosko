/// <reference types="jest-extended" />
import { Service } from "kubernetes-models/v1/Service";
import { createManifest, validateAll } from "../test-utils";
import rule from "./no-missing-service";
import { Ingress } from "kubernetes-models/networking.k8s.io/v1";
import { HTTPRoute } from "@kubernetes-models/gateway-api/gateway.networking.k8s.io/v1/HTTPRoute";
import { GRPCRoute } from "@kubernetes-models/gateway-api/gateway.networking.k8s.io/v1alpha2/GRPCRoute";

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
      metadata: { name: "bar", namespace: "xyz" },
      spec: {
        defaultBackend: { service: { name: "abc" } }
      }
    })
  );
  expect(
    validateAll(rule, { allow: [{ name: "a*", namespace: "x*" }] }, [ingress])
  ).toBeEmpty();
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

test("should check backend ref in http route", () => {
  const manifest = createManifest(
    new HTTPRoute({
      metadata: { name: "foo" },
      spec: {
        rules: [
          {
            backendRefs: [{ kind: "Service", name: "bar" }]
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

test("should pass when backend ref in http route is undefined", () => {
  const manifest = createManifest(
    new HTTPRoute({
      metadata: { name: "foo" },
      spec: {
        rules: [{}]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test(`should pass when backend ref kind is not "Service"`, () => {
  const manifest = createManifest(
    new HTTPRoute({
      metadata: { name: "foo" },
      spec: {
        rules: [
          {
            backendRefs: [{ kind: "HTTPRoute", name: "bar" }]
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when backend ref group is not empty", () => {
  const manifest = createManifest(
    new HTTPRoute({
      metadata: { name: "foo" },
      spec: {
        rules: [
          {
            backendRefs: [
              { group: "networking.k8s.io", kind: "HTTPRoute", name: "bar" }
            ]
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should check when backend ref group is empty", () => {
  const manifest = createManifest(
    new HTTPRoute({
      metadata: { name: "foo" },
      spec: {
        rules: [
          {
            backendRefs: [{ group: "", kind: "Service", name: "bar" }]
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

test("should prefer backend ref namespace over manifest namespace", () => {
  const service = createManifest(
    new Service({
      metadata: { name: "foo", namespace: "a" }
    })
  );
  const route = createManifest(
    new HTTPRoute({
      metadata: { name: "bar", namespace: "a" },
      spec: {
        rules: [
          {
            backendRefs: [{ kind: "Service", name: "foo", namespace: "b" }]
          }
        ]
      }
    })
  );
  expect(validateAll(rule, undefined, [service, route])).toEqual([
    {
      manifest: route,
      message: `Service "foo" does not exist in namespace "b".`
    }
  ]);
});

test("should check backend ref in grpc route", () => {
  const manifest = createManifest(
    new GRPCRoute({
      metadata: { name: "foo" },
      spec: {
        rules: [
          {
            backendRefs: [{ kind: "Service", name: "bar" }]
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
