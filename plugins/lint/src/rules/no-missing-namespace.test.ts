/// <reference types="jest-extended" />
import rule from "./no-missing-namespace";
import { createManifest, validateAll } from "../test-utils";
import { Namespace } from "kubernetes-models/v1/Namespace";
import { Pod } from "kubernetes-models/v1/Pod";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when namespace is empty", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { namespace: "" }
    })
  );

  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when namespace is undefined", () => {
  const manifest = createManifest(new Pod({ metadata: {} }));

  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should pass when metadata is undefined", () => {
  const manifest = createManifest(new Pod({}));

  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test(`should pass when namespace is "default"`, () => {
  const manifest = createManifest(
    new Pod({
      metadata: { namespace: "default", name: "foo" }
    })
  );

  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test(`should pass when namespace is "kube-system"`, () => {
  const manifest = createManifest(
    new Pod({
      metadata: { namespace: "kube-system", name: "foo" }
    })
  );

  expect(validateAll(rule, undefined, [manifest])).toBeEmpty();
});

test("should report when namespace does not exist", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { namespace: "test", name: "foo" }
    })
  );

  expect(validateAll(rule, undefined, [manifest])).toEqual([
    {
      manifest,
      message: `Namespace "test" does not exist or is not allowed.`
    }
  ]);
});

test("should pass when namespace is allowed", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { namespace: "test", name: "foo" }
    })
  );

  expect(validateAll(rule, { allow: ["test"] }, [manifest])).toBeEmpty();
});

test(`should override allowed namespaces when "allow" is defined`, () => {
  const manifest = createManifest(
    new Pod({
      metadata: { namespace: "default", name: "foo" }
    })
  );

  expect(validateAll(rule, { allow: ["test"] }, [manifest])).toEqual([
    {
      manifest,
      message: `Namespace "default" does not exist or is not allowed.`
    }
  ]);
});

test("should pass when namespace exists", () => {
  const namespace = createManifest(
    new Namespace({ metadata: { name: "test" } })
  );
  const manifest = createManifest(
    new Pod({ metadata: { namespace: "test", name: "foo" } })
  );

  expect(validateAll(rule, undefined, [namespace, manifest])).toBeEmpty();
});
