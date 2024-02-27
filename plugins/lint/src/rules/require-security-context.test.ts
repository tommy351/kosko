/// <reference types="jest-extended" />
import { Pod } from "kubernetes-models/v1/Pod";
import { createManifest, validate } from "../test-utils";
import rule from "./require-security-context";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});
  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when config is undefined", () => {
  const manifest = createManifest({
    spec: {
      containers: [{ name: "test" }]
    }
  });

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

describe.each([
  { key: "allowPrivilegeEscalation", value: true },
  { key: "allowPrivilegeEscalation", value: false },
  { key: "privileged", value: true },
  { key: "privileged", value: false },
  { key: "runAsNonRoot", value: true },
  { key: "runAsNonRoot", value: false },
  { key: "readOnlyRootFilesystem", value: true },
  { key: "readOnlyRootFilesystem", value: false }
])("when config.$key = $value", ({ key, value }) => {
  test(`should pass when ${key} = ${value}`, () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "test" },
        spec: {
          containers: [
            {
              name: "test",
              securityContext: { [key]: value }
            }
          ]
        }
      })
    );

    expect(validate(rule, { [key]: value }, manifest)).toBeEmpty();
  });

  test(`should report when ${key} = ${!value}`, () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "test" },
        spec: {
          containers: [
            {
              name: "test",
              securityContext: { [key]: !value }
            }
          ]
        }
      })
    );

    expect(validate(rule, { [key]: value }, manifest)).toEqual([
      {
        manifest,
        message: `Container "test" must set securityContext.${key} to ${value}.`
      }
    ]);
  });

  test(`should report when ${key} is undefined`, () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "test" },
        spec: {
          containers: [{ name: "test", securityContext: {} }]
        }
      })
    );

    expect(validate(rule, { [key]: value }, manifest)).toEqual([
      {
        manifest,
        message: `Container "test" must set securityContext.${key} to ${value}.`
      }
    ]);
  });

  test("should report when securityContext is undefined", () => {
    const manifest = createManifest(
      new Pod({
        metadata: { name: "test" },
        spec: {
          containers: [{ name: "test" }]
        }
      })
    );

    expect(validate(rule, { [key]: value }, manifest)).toEqual([
      {
        manifest,
        message: `Container "test" must define a security context.`
      }
    ]);
  });
});
