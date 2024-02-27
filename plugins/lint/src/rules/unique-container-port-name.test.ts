import { Pod } from "kubernetes-models/v1/Pod";
import { createManifest, validate } from "../test-utils";
import rule from "./unique-container-port-name";

test("should pass when data is undefined", () => {
  const manifest = createManifest(undefined);

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when data is an empty object", () => {
  const manifest = createManifest({});

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when spec is undefined", () => {
  const manifest = createManifest(new Pod({ metadata: { name: "test" } }));

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should pass when container port names are unique", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [
          { name: "a", ports: [{ name: "foo", containerPort: 80 }] },
          { name: "b", ports: [{ name: "bar", containerPort: 81 }] }
        ]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toBeEmpty();
});

test("should report when container port names are not unique within the same container", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [
          {
            name: "a",
            ports: [
              { name: "foo", containerPort: 80 },
              { name: "foo", containerPort: 81 }
            ]
          }
        ]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Port name "foo" is already used by container "a".`
    }
  ]);
});

test("should report when container port names are not unique across different containers", () => {
  const manifest = createManifest(
    new Pod({
      metadata: { name: "test" },
      spec: {
        containers: [
          { name: "a", ports: [{ name: "foo", containerPort: 80 }] },
          { name: "b", ports: [{ name: "foo", containerPort: 81 }] }
        ]
      }
    })
  );

  expect(validate(rule, undefined, manifest)).toEqual([
    {
      manifest,
      message: `Port name "foo" is already used by container "a".`
    }
  ]);
});
