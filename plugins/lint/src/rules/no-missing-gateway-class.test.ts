/// <reference types="jest-extended" />
import { Gateway } from "@kubernetes-models/gateway-api/gateway.networking.k8s.io/v1/Gateway";
import { GatewayClass } from "@kubernetes-models/gateway-api/gateway.networking.k8s.io/v1/GatewayClass";
import { createManifest, validateAll } from "../test-utils";
import rule from "./no-missing-gateway-class";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when gatewayClassName is empty", () => {
  const manifest = createManifest(
    new Gateway({
      metadata: { name: "foo" },
      spec: {
        gatewayClassName: "",
        listeners: []
      }
    })
  );
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when gateway class exists", () => {
  const gatewayClass = createManifest(
    new GatewayClass({
      metadata: { name: "bar" },
      spec: {
        controllerName: ""
      }
    })
  );
  const gateway = createManifest(
    new Gateway({
      metadata: { name: "foo" },

      spec: {
        gatewayClassName: "bar",
        listeners: []
      }
    })
  );
  expect(validateAll(rule, undefined, [gatewayClass, gateway])).toBeEmpty();
});

test("should pass when gateway class is allowed", () => {
  const gateway = createManifest(
    new Gateway({
      metadata: { name: "foo" },

      spec: {
        gatewayClassName: "bar",
        listeners: []
      }
    })
  );
  expect(validateAll(rule, { allow: ["bar"] }, [gateway])).toBeEmpty();
});

test("should report when gateway class does not exist", () => {
  const gateway = createManifest(
    new Gateway({
      metadata: { name: "foo" },

      spec: {
        gatewayClassName: "bar",
        listeners: []
      }
    })
  );
  expect(validateAll(rule, undefined, [gateway])).toEqual([
    {
      manifest: gateway,
      message: `GatewayClass "bar" does not exist.`
    }
  ]);
});
