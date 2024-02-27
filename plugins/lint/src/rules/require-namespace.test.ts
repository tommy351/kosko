import { createManifest, validate } from "../test-utils";
import rule from "./require-namespace";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should report when namespace is an empty string", () => {
  const manifest = createManifest({
    metadata: { namespace: "" }
  });

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: "Namespace must not be empty."
    }
  ]);
});

test("should report when namespace is undefined", () => {
  const manifest = createManifest({
    metadata: { name: "test" }
  });

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: "Namespace must not be empty."
    }
  ]);
});

test("should report when metadata is undefined", () => {
  const manifest = createManifest({});

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: "Namespace must not be empty."
    }
  ]);
});
