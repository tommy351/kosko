/// <reference types="jest-extended" />
import rule from "./ban-namespace";
import { createManifest, validate } from "../test-utils";
import { Pod } from "kubernetes-models/v1/Pod";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);
  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when namespace is undefined", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo" }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when config is undefined", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo", namespace: "default" }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when config is an empty object", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo", namespace: "default" }
    })
  );

  expect(validate(rule, {}, manifest)).toBeEmpty();
});

test("should report when namespace is banned", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo", namespace: "default" }
    })
  );

  expect(validate(rule, { namespaces: ["default"] }, manifest)).toEqual([
    {
      manifest,
      message: 'Namespace "default" is banned.'
    }
  ]);
});

test("should report when namespace matches a pattern", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo", namespace: "kube-system" }
    })
  );

  expect(validate(rule, { namespaces: ["kube-*"] }, manifest)).toEqual([
    {
      manifest,
      message: 'Namespace "kube-system" is banned.'
    }
  ]);
});

test("should pass when namespace does not match any pattern", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "foo", namespace: "kube-system" }
    })
  );

  expect(validate(rule, { namespaces: ["default"] }, manifest)).toBeEmpty();
});
