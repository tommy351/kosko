import rule from "./no-missing-namespace";
import { createManifest, validateAll } from "../test-utils";
import { Namespace } from "kubernetes-models/v1";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);
  expect(validateAll(rule, {}, [manifest])).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validateAll(rule, {}, [manifest])).toBeEmpty();
});

test("should pass when namespace is empty", () => {
  const manifest = createManifest({
    metadata: { namespace: "" }
  });

  expect(validateAll(rule, {}, [manifest])).toBeEmpty();
});

test("should pass when namespace is undefined", () => {
  const manifest = createManifest({ metadata: {} });

  expect(validateAll(rule, {}, [manifest])).toBeEmpty();
});

test("should pass when metadata is undefined", () => {
  const manifest = createManifest({});

  expect(validateAll(rule, {}, [manifest])).toBeEmpty();
});

test(`should pass when namespace is "default"`, () => {
  const manifest = createManifest({
    metadata: { namespace: "default" }
  });

  expect(validateAll(rule, {}, [manifest])).toBeEmpty();
});

test(`should pass when namespace is "kube-system"`, () => {
  const manifest = createManifest({
    metadata: { namespace: "kube-system" }
  });

  expect(validateAll(rule, {}, [manifest])).toBeEmpty();
});

test("should report when namespace does not exist", () => {
  const manifest = createManifest({
    metadata: { namespace: "test" }
  });

  expect(validateAll(rule, {}, [manifest])).toEqual([
    {
      manifest,
      message: `Namespace "test" does not exist or is not allowed.`
    }
  ]);
});

test("should pass when namespace is allowed", () => {
  const manifest = createManifest({
    metadata: { namespace: "test" }
  });

  expect(validateAll(rule, { allow: ["test"] }, [manifest])).toBeEmpty();
});

test(`should override allowed namespaces when "allow" is defined`, () => {
  const manifest = createManifest({
    metadata: { namespace: "default" }
  });

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
  const manifest = createManifest({ metadata: { namespace: "test" } });

  expect(validateAll(rule, {}, [namespace, manifest])).toBeEmpty();
});
