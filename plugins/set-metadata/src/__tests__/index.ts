import assert from "node:assert";
import factory from "../index";

function transformManifest(config: unknown, data: unknown) {
  const plugin = factory({ cwd: "", config });
  assert(plugin.transformManifest);

  return plugin.transformManifest({ path: "", index: [], data });
}

test("throws an error when config is undefined", () => {
  expect(() => factory({ cwd: "" })).toThrow(
    "Expected an object, but received: undefined"
  );
});

test("returns an empty object when config is an empty object", () => {
  const plugin = factory({ cwd: "", config: {} });
  expect(plugin).toEqual({});
});

test("throws an error when config.namespace is {}", () => {
  expect(() => factory({ cwd: "", config: { namespace: {} } })).toThrow(
    "At path: namespace.value -- Expected a string, but received: undefined"
  );
});

test("ignores undefined data", () => {
  expect(
    transformManifest({ namespace: { value: "foo" } }, undefined)
  ).toBeUndefined();
});

test("ignores empty data", () => {
  expect(transformManifest({ namespace: { value: "foo" } }, {})).toEqual({});
});

test("ignores non-object data", () => {
  expect(transformManifest({ namespace: { value: "foo" } }, "foo")).toEqual(
    "foo"
  );
});

test("ignores undefined metadata", () => {
  expect(
    transformManifest({ namespace: { value: "foo" } }, { foo: "bar" })
  ).toEqual({ foo: "bar" });
});

test("ignore non-object metadata", () => {
  expect(
    transformManifest({ namespace: { value: "foo" } }, { metadata: "foo" })
  ).toEqual({ metadata: "foo" });
});

describe("namespace", () => {
  test("sets namespace if undefined", () => {
    expect(
      transformManifest({ namespace: { value: "foo" } }, { metadata: {} })
    ).toEqual({ metadata: { namespace: "foo" } });
  });

  test("does not override namespace by default", () => {
    expect(
      transformManifest(
        { namespace: { value: "foo" } },
        { metadata: { namespace: "bar" } }
      )
    ).toEqual({ metadata: { namespace: "bar" } });
  });

  test('overrides namespace when "override" is true', () => {
    expect(
      transformManifest(
        { namespace: { value: "foo", override: true } },
        { metadata: { namespace: "bar" } }
      )
    ).toEqual({ metadata: { namespace: "foo" } });
  });

  test('does not override namespace when "override" is false', () => {
    expect(
      transformManifest(
        { namespace: { value: "foo", override: false } },
        { metadata: { namespace: "bar" } }
      )
    ).toEqual({ metadata: { namespace: "bar" } });
  });
});

describe("name", () => {
  test("ignores if name is undefined", () => {
    expect(
      transformManifest({ name: { prefix: "foo" } }, { metadata: {} })
    ).toEqual({ metadata: {} });
  });

  test("ignores if name is not a string", () => {
    expect(
      transformManifest({ name: { prefix: "foo" } }, { metadata: { name: 1 } })
    ).toEqual({ metadata: { name: 1 } });
  });

  test('appends prefix when "prefix" is defined', () => {
    expect(
      transformManifest(
        { name: { prefix: "foo" } },
        { metadata: { name: "bar" } }
      )
    ).toEqual({ metadata: { name: "foobar" } });
  });

  test('appends suffix when "suffix" is defined', () => {
    expect(
      transformManifest(
        { name: { suffix: "foo" } },
        { metadata: { name: "bar" } }
      )
    ).toEqual({ metadata: { name: "barfoo" } });
  });

  test("appends prefix and suffix when both are defined", () => {
    expect(
      transformManifest(
        { name: { prefix: "a", suffix: "c" } },
        { metadata: { name: "b" } }
      )
    ).toEqual({ metadata: { name: "abc" } });
  });
});

describe("labels", () => {
  test("ignores non-object labels", () => {
    expect(
      transformManifest(
        { labels: [{ name: "foo", value: "bar" }] },
        { metadata: { labels: "foo" } }
      )
    ).toEqual({ metadata: { labels: "foo" } });
  });

  test("sets label when key does not exist", () => {
    expect(
      transformManifest(
        { labels: [{ name: "foo", value: "bar" }] },
        { metadata: {} }
      )
    ).toEqual({ metadata: { labels: { foo: "bar" } } });
  });

  test("does not override label by default", () => {
    expect(
      transformManifest(
        { labels: [{ name: "foo", value: "bar" }] },
        { metadata: { labels: { foo: "baz" } } }
      )
    ).toEqual({ metadata: { labels: { foo: "baz" } } });
  });

  test("overrides label when override is true", () => {
    expect(
      transformManifest(
        { labels: [{ name: "foo", value: "bar", override: true }] },
        { metadata: { labels: { foo: "baz" } } }
      )
    ).toEqual({ metadata: { labels: { foo: "bar" } } });
  });

  test('does not override label when "override" is false', () => {
    expect(
      transformManifest(
        { labels: [{ name: "foo", value: "bar", override: false }] },
        { metadata: { labels: { foo: "baz" } } }
      )
    ).toEqual({ metadata: { labels: { foo: "baz" } } });
  });

  test("sets multiple labels", () => {
    expect(
      transformManifest(
        {
          labels: [
            { name: "a", value: "b" },
            { name: "c", value: "d" }
          ]
        },
        { metadata: {} }
      )
    ).toEqual({ metadata: { labels: { a: "b", c: "d" } } });
  });
});

describe("annotations", () => {
  test("ignores non-object annotations", () => {
    expect(
      transformManifest(
        { annotations: [{ name: "foo", value: "bar" }] },
        { metadata: { annotations: "foo" } }
      )
    ).toEqual({ metadata: { annotations: "foo" } });
  });

  test("sets annotation when key does not exist", () => {
    expect(
      transformManifest(
        { annotations: [{ name: "foo", value: "bar" }] },
        { metadata: {} }
      )
    ).toEqual({ metadata: { annotations: { foo: "bar" } } });
  });

  test("does not override annotation by default", () => {
    expect(
      transformManifest(
        { annotations: [{ name: "foo", value: "bar" }] },
        { metadata: { annotations: { foo: "baz" } } }
      )
    ).toEqual({ metadata: { annotations: { foo: "baz" } } });
  });

  test("overrides annotation when override is true", () => {
    expect(
      transformManifest(
        { annotations: [{ name: "foo", value: "bar", override: true }] },
        { metadata: { annotations: { foo: "baz" } } }
      )
    ).toEqual({ metadata: { annotations: { foo: "bar" } } });
  });

  test('does not override annotation when "override" is false', () => {
    expect(
      transformManifest(
        { annotations: [{ name: "foo", value: "bar", override: false }] },
        { metadata: { annotations: { foo: "baz" } } }
      )
    ).toEqual({ metadata: { annotations: { foo: "baz" } } });
  });

  test("sets multiple annotations", () => {
    expect(
      transformManifest(
        {
          annotations: [
            { name: "a", value: "b" },
            { name: "c", value: "d" }
          ]
        },
        { metadata: {} }
      )
    ).toEqual({ metadata: { annotations: { a: "b", c: "d" } } });
  });
});
