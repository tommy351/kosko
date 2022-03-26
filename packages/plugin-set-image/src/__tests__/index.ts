import factory from "../index";
import assert from "assert";
import { IPodSpec, Service, IoK8sApiCoreV1Pod } from "kubernetes-models/v1";
import { ModelConstructor } from "@kubernetes-models/base";

const plugin = factory(
  { cwd: __dirname },
  { from: "kosko/image:foo", to: "kosko/image:bar" }
);

describe("Arbitrary value", () => {
  describe.each([
    ["Kubernetes API object", new Service()],
    ["Object", {}],
    ["Array", []],
    ["Boolean", true],
    ["Number", 3.14]
  ])("input = %s", (_, input) => {
    test("should skip transform", () => {
      const actual = plugin.hooks?.transformManifest?.(input);
      expect(actual).toEqual(input);
    });
  });
});

function ensureDefined<T>(value: T | null | undefined): T {
  assert(value);
  return value;
}

function runTests<T>({
  kind,
  getPodSpec,
  setPodSpec
}: {
  kind: ModelConstructor<T>;
  getPodSpec(data: T): IPodSpec;
  setPodSpec(data: T, spec: IPodSpec): void;
}) {
  describe.each([
    // Exact match
    {
      from: "kosko/image:test",
      to: "kosko/image:foo",
      expected: "kosko/image:foo"
    },
    // Match name only
    {
      from: { name: "kosko/image" },
      to: "kosko/image:foo",
      expected: "kosko/image:foo"
    },
    // Match tag only
    {
      from: { tag: "test" },
      to: "kosko/image:foo",
      expected: "kosko/image:foo"
    },
    // Not exact match
    {
      from: "kosko/image:test2",
      to: "kosko/image:foo",
      expected: "kosko/image:test"
    },
    {
      from: { name: "kosko/image2:test" },
      to: "kosko/image:foo",
      expected: "kosko/image:test"
    },
    // Name not match
    {
      from: { name: "kosko/image2" },
      to: "kosko/image:foo",
      expected: "kosko/image:test"
    },
    // Tag not match
    {
      from: { tag: "test2" },
      to: "kosko/image:foo",
      expected: "kosko/image:test"
    },
    // Set image name only
    {
      from: "kosko/image:test",
      to: { name: "foo" },
      expected: "foo:test"
    },
    // Set image tag only
    {
      from: "kosko/image:test",
      to: { tag: "foo" },
      expected: "kosko/image:foo"
    }
  ])("from: $from, to: $to", ({ from, to, expected }) => {
    test(`should set image = "${expected}"`, () => {
      const plugin = factory({ cwd: __dirname }, { from, to });
      const input = new kind();

      setPodSpec(input as any, {
        containers: [{ name: "test", image: "kosko/image:test" }]
      });
      plugin.hooks?.transformManifest?.(input);

      expect(getPodSpec(input as any)).toEqual({
        containers: [{ name: "test", image: expected }]
      });
    });
  });

  test("plain object", () => {
    const plugin = factory({ cwd: __dirname }, { from: "foo", to: "bar" });
    const input = new kind();

    setPodSpec(input as any, {
      containers: [{ name: "test", image: "foo" }]
    });

    const actual = plugin.hooks?.transformManifest?.(input.toJSON());
    expect(getPodSpec(actual as any)).toEqual({
      containers: [{ name: "test", image: "bar" }]
    });
  });

  test.todo("multiple containers");
}

describe("v1 Pod", () => {
  runTests({
    kind: IoK8sApiCoreV1Pod,
    getPodSpec: (data) => ensureDefined(data.spec),
    setPodSpec: (data, spec) => {
      data.spec = spec;
    }
  });
});
