import assert from "node:assert";
import factory from "../index";
import { Pod } from "kubernetes-models/v1/Pod";
import { ObjectMeta } from "@kubernetes-models/apimachinery/apis/meta/v1/ObjectMeta";

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

test("ignores null data", () => {
  expect(transformManifest({ namespace: { value: "foo" } }, null)).toBeNull();
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

test("does not convert data into a plain object", () => {
  const data = new Pod({ metadata: { name: "foo" } });
  const actual = transformManifest({ namespace: { value: "bar" } }, data);

  expect(actual).toBeInstanceOf(Pod);
});

test("does not convert metadata into a plain object", () => {
  const data = new Pod({ metadata: new ObjectMeta({ name: "foo" }) });
  const actual = transformManifest({ namespace: { value: "bar" } }, data);

  expect((actual as any).metadata).toBeInstanceOf(ObjectMeta);
});

test("keeps key order", () => {
  const data = { a: 1, metadata: { name: "foo" }, b: 2 };
  const actual = transformManifest({ namespace: { value: "bar" } }, data);

  expect(JSON.stringify(actual)).toEqual(
    JSON.stringify({
      a: 1,
      metadata: { name: "foo", namespace: "bar" },
      b: 2
    })
  );
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

  test("sets namespace when namespace is an empty string", () => {
    expect(
      transformManifest(
        { namespace: { value: "foo" } },
        { metadata: { namespace: "" } }
      )
    ).toEqual({ metadata: { namespace: "foo" } });
  });

  test("keeps key order", () => {
    const actual = transformManifest(
      { namespace: { value: "foo", override: true } },
      { metadata: { a: 1, namespace: "bar", b: 2 } }
    );

    expect(JSON.stringify(actual)).toEqual(
      JSON.stringify({ metadata: { a: 1, namespace: "foo", b: 2 } })
    );
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

  test("keeps key order", () => {
    const actual = transformManifest(
      { name: { prefix: "a", suffix: "c" } },
      { metadata: { a: 1, name: "b", b: 2 } }
    );

    expect(JSON.stringify(actual)).toEqual(
      JSON.stringify({ metadata: { a: 1, name: "abc", b: 2 } })
    );
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

  test("keeps key order", () => {
    const actual = transformManifest(
      {
        labels: [
          { name: "d", value: "new", override: true },
          { name: "foo", value: "bar" }
        ]
      },
      { metadata: { a: 1, labels: { c: 3, d: 4, e: 5 }, b: 2 } }
    );

    expect(JSON.stringify(actual)).toEqual(
      JSON.stringify({
        metadata: { a: 1, labels: { c: 3, d: "new", e: 5, foo: "bar" }, b: 2 }
      })
    );
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

  test("keeps key order", () => {
    const actual = transformManifest(
      {
        annotations: [
          { name: "d", value: "new", override: true },
          { name: "foo", value: "bar" }
        ]
      },
      { metadata: { a: 1, annotations: { c: 3, d: 4, e: 5 }, b: 2 } }
    );

    expect(JSON.stringify(actual)).toEqual(
      JSON.stringify({
        metadata: {
          a: 1,
          annotations: { c: 3, d: "new", e: 5, foo: "bar" },
          b: 2
        }
      })
    );
  });
});
