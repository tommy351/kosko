/// <reference types="jest-extended" />
import { HTTPRoute } from "@kubernetes-models/gateway-api/gateway.networking.k8s.io/v1/HTTPRoute";
import { Gateway } from "@kubernetes-models/gateway-api/gateway.networking.k8s.io/v1/Gateway";
import { createManifest, validateAll } from "../test-utils";
import rule from "./no-missing-gateway";
import { GRPCRoute } from "@kubernetes-models/gateway-api/gateway.networking.k8s.io/v1alpha2/GRPCRoute";
import { TCPRoute } from "@kubernetes-models/gateway-api/gateway.networking.k8s.io/v1alpha2/TCPRoute";
import { UDPRoute } from "@kubernetes-models/gateway-api/gateway.networking.k8s.io/v1alpha2/UDPRoute";
import { TLSRoute } from "@kubernetes-models/gateway-api/gateway.networking.k8s.io/v1alpha2/TLSRoute";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when parentRefs is undefined", () => {
  const manifest = createManifest(
    new HTTPRoute({
      metadata: { name: "foo" },
      spec: {}
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test(`should pass when kind is defined and not "Gateway"`, () => {
  const manifest = createManifest(
    new HTTPRoute({
      metadata: { name: "foo" },
      spec: { parentRefs: [{ kind: "Ingress", name: "bar" }] }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test(`should pass when group is defined and not "gateway.networking.k8s.io"`, () => {
  const manifest = createManifest(
    new HTTPRoute({
      metadata: { name: "foo" },
      spec: {
        parentRefs: [{ group: "networking.k8s.io", name: "bar" }]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when group is empty", () => {
  const manifest = createManifest(
    new HTTPRoute({
      metadata: { name: "foo" },
      spec: {
        parentRefs: [{ group: "", name: "bar" }]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when gateway exists in the same namespace", () => {
  const gateway = createManifest(
    new Gateway({
      metadata: { name: "bar", namespace: "a" },
      spec: {
        gatewayClassName: "",
        listeners: []
      }
    })
  );
  const route = createManifest(
    new HTTPRoute({
      metadata: { name: "foo", namespace: "a" },
      spec: {
        parentRefs: [{ name: "bar" }]
      }
    })
  );
  expect(validateAll(rule, undefined, [gateway, route])).toBeEmpty();
});

test("should report when gateway exists in a different namespace", () => {
  const gateway = createManifest(
    new Gateway({
      metadata: { name: "bar", namespace: "b" },
      spec: {
        gatewayClassName: "",
        listeners: []
      }
    })
  );
  const route = createManifest(
    new HTTPRoute({
      metadata: { name: "foo", namespace: "a" },
      spec: {
        parentRefs: [{ name: "bar" }]
      }
    })
  );
  expect(validateAll(rule, undefined, [gateway, route])).toEqual([
    {
      manifest: route,
      message: `Gateway "bar" does not exist in namespace "a".`
    }
  ]);
});

test("should prefer parent ref namespace over manifest namespace", () => {
  const gateway = createManifest(
    new Gateway({
      metadata: { name: "bar", namespace: "a" },
      spec: {
        gatewayClassName: "",
        listeners: []
      }
    })
  );
  const route = createManifest(
    new HTTPRoute({
      metadata: { name: "foo", namespace: "b" },
      spec: {
        parentRefs: [{ name: "bar", namespace: "a" }]
      }
    })
  );
  expect(validateAll(rule, undefined, [gateway, route])).toBeEmpty();
});

test("should check when ref kind is Gateway", () => {
  const manifest = createManifest(
    new HTTPRoute({
      metadata: { name: "foo" },
      spec: {
        parentRefs: [{ kind: "Gateway", name: "bar" }]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest,
      message: `Gateway "bar" does not exist.`
    }
  ]);
});

test(`should check when ref group is "gateway.networking.k8s.io"`, () => {
  const manifest = createManifest(
    new HTTPRoute({
      metadata: { name: "foo" },
      spec: {
        parentRefs: [{ group: "gateway.networking.k8s.io", name: "bar" }]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest,
      message: `Gateway "bar" does not exist.`
    }
  ]);
});

test("should check GRPCRoute", () => {
  const manifest = createManifest(
    new GRPCRoute({
      metadata: { name: "foo" },
      spec: {
        parentRefs: [{ name: "bar" }]
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest,
      message: `Gateway "bar" does not exist.`
    }
  ]);
});

test("should check TCPRoute", () => {
  const manifest = createManifest(
    new TCPRoute({
      metadata: { name: "foo" },
      spec: {
        parentRefs: [{ name: "bar" }],
        rules: []
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest,
      message: `Gateway "bar" does not exist.`
    }
  ]);
});

test("should check TLSRoute", () => {
  const manifest = createManifest(
    new TLSRoute({
      metadata: { name: "foo" },
      spec: {
        parentRefs: [{ name: "bar" }],
        rules: []
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest,
      message: `Gateway "bar" does not exist.`
    }
  ]);
});

test("should check UDPRoute", () => {
  const manifest = createManifest(
    new UDPRoute({
      metadata: { name: "foo" },
      spec: {
        parentRefs: [{ name: "bar" }],
        rules: []
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest,
      message: `Gateway "bar" does not exist.`
    }
  ]);
});
