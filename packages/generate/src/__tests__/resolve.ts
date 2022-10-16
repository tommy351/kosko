/// <reference types="jest-extended" />
import { getRejectedValue } from "@kosko/test-utils";
import AggregateError from "@kosko/aggregate-error";
import assert from "node:assert";
import { ResolveError } from "../error";
import { resolve } from "../resolve";

test("value is an object", async () => {
  await expect(resolve({ foo: "bar" })).resolves.toEqual([
    { path: "", index: [], data: { foo: "bar" } }
  ]);
});

test("value is an array", async () => {
  await expect(resolve([{ a: "b" }, { c: "d" }])).resolves.toEqual([
    { path: "", index: [0], data: { a: "b" } },
    { path: "", index: [1], data: { c: "d" } }
  ]);
});

test("value is a function that returns an object", async () => {
  await expect(resolve(() => ({ foo: "bar" }))).resolves.toEqual([
    { path: "", index: [], data: { foo: "bar" } }
  ]);
});

test("value is a function that returns an array", async () => {
  await expect(resolve(() => [{ a: "b" }, { c: "d" }])).resolves.toEqual([
    { path: "", index: [0], data: { a: "b" } },
    { path: "", index: [1], data: { c: "d" } }
  ]);
});

test("value is a function that returns a Promise", async () => {
  await expect(resolve(async () => ({ foo: "bar" }))).resolves.toEqual([
    { path: "", index: [], data: { foo: "bar" } }
  ]);
});

test("value is a function that throws an error", async () => {
  const value = () => {
    throw new Error("err");
  };
  const err = await getRejectedValue(
    resolve(value, {
      path: "test",
      index: [5]
    })
  );

  assert(err instanceof ResolveError);
  expect(err.message).toEqual("Input function value thrown an error");
  expect(err.path).toEqual("test");
  expect(err.index).toEqual([5]);
  expect(err.value).toEqual(value);
  expect(err.cause).toEqual(new Error("err"));
});

test("value is an async function that throws an error", async () => {
  const value = async () => {
    throw new Error("err");
  };
  const err = await getRejectedValue(
    resolve(value, {
      path: "test",
      index: [5]
    })
  );

  assert(err instanceof ResolveError);
  expect(err.message).toEqual("Input function value thrown an error");
  expect(err.path).toEqual("test");
  expect(err.index).toEqual([5]);
  expect(err.value).toEqual(value);
  expect(err.cause).toEqual(new Error("err"));
});

test("value is a resolved Promise", async () => {
  await expect(resolve(Promise.resolve({ foo: "bar" }))).resolves.toEqual([
    { path: "", index: [], data: { foo: "bar" } }
  ]);
});

test("value is a rejected Promise", async () => {
  const value = Promise.reject(new Error("err"));

  const err = await getRejectedValue(
    resolve(value, {
      path: "test",
      index: [5]
    })
  );

  assert(err instanceof ResolveError);
  expect(err.message).toEqual("Input promise value rejected");
  expect(err.path).toEqual("test");
  expect(err.index).toEqual([5]);
  expect(err.value).toEqual(value);
  expect(err.cause).toEqual(new Error("err"));
});

test("value is a Set", async () => {
  await expect(resolve(new Set([{ a: "b" }, { c: "d" }]))).resolves.toEqual([
    { path: "", index: [0], data: { a: "b" } },
    { path: "", index: [1], data: { c: "d" } }
  ]);
});

test("value is a generator function", async () => {
  function* value() {
    yield { a: "b" };
    yield { c: "d" };
  }

  await expect(resolve(value)).resolves.toEqual([
    { path: "", index: [0], data: { a: "b" } },
    { path: "", index: [1], data: { c: "d" } }
  ]);
});

test("value is a generator function that throws an error", async () => {
  function* value() {
    yield { a: "b" };
    throw new Error("err");
  }
  const err = await getRejectedValue(
    resolve(value, {
      path: "test",
      index: [5]
    })
  );

  assert(err instanceof ResolveError);
  expect(err.message).toEqual("Input iterable value thrown an error");
  expect(err.path).toEqual("test");
  expect(err.index).toEqual([5]);
  expect(err.cause).toEqual(new Error("err"));
  // TODO: Assert `err.value`
});

test("value is an async generator function", async () => {
  async function* value() {
    yield { a: "b" };
    yield { c: "d" };
  }

  await expect(resolve(value)).resolves.toEqual([
    { path: "", index: [0], data: { a: "b" } },
    { path: "", index: [1], data: { c: "d" } }
  ]);
});

test("value is an async generator function that throws an error", async () => {
  async function* value() {
    yield { a: "b" };
    throw new Error("err");
  }
  const err = await getRejectedValue(
    resolve(value, {
      path: "test",
      index: [5]
    })
  );

  assert(err instanceof ResolveError);
  expect(err.message).toEqual("Input async iterable value thrown an error");
  expect(err.path).toEqual("test");
  expect(err.index).toEqual([5]);
  expect(err.cause).toEqual(new Error("err"));
  // TODO: Assert `err.value`
});

test("value is undefined", async () => {
  await expect(resolve(undefined)).resolves.toEqual([
    { path: "", index: [], data: undefined }
  ]);
});

test("value is null", async () => {
  await expect(resolve(null)).resolves.toEqual([
    { path: "", index: [], data: null }
  ]);
});

test("value is a string", async () => {
  await expect(resolve("foo")).resolves.toEqual([
    { path: "", index: [], data: "foo" }
  ]);
});

test("value is nested", async () => {
  await expect(
    resolve([
      { a: 1 },
      // Returns an object
      () => ({ b: 2 }),
      // Returns an array
      () => [{ c: 3 }, { d: 4 }],
      // Returns an promise
      async () => ({ e: 5 }),
      // Returns an promise returning an array
      async () => [{ f: 6 }, { g: 7 }]
    ])
  ).resolves.toEqual([
    { path: "", index: [0], data: { a: 1 } },
    { path: "", index: [1], data: { b: 2 } },
    { path: "", index: [2, 0], data: { c: 3 } },
    { path: "", index: [2, 1], data: { d: 4 } },
    { path: "", index: [3], data: { e: 5 } },
    { path: "", index: [4, 0], data: { f: 6 } },
    { path: "", index: [4, 1], data: { g: 7 } }
  ]);
});

test("value should be validated by default", async () => {
  const validate = jest.fn();

  await expect(
    resolve({
      foo: "bar",
      validate
    })
  ).resolves.toBeTruthy();
  expect(validate).toHaveBeenCalledTimes(1);
});

test("should throw ResolveError when validate throws an error", async () => {
  const value = {
    c: "d",
    validate() {
      throw new Error("err");
    }
  };
  const err = await getRejectedValue(
    resolve(value, { path: "test", index: [5] })
  );

  assert(err instanceof ResolveError);
  expect(err.message).toEqual("Validation error");
  expect(err.path).toEqual("test");
  expect(err.index).toEqual([5]);
  expect(err.value).toEqual(value);
  expect(err.cause).toEqual(new Error("err"));
});

test("should throw AggregateError when nested validate throws an error", async () => {
  const values = [
    { a: "b" },
    {
      c: "d",
      validate() {
        throw new Error("first err");
      }
    },
    { e: "f" },
    {
      g: "h",
      validate() {
        throw new Error("second err");
      }
    },
    { i: "j" }
  ];
  const err = await getRejectedValue(
    resolve(values, {
      path: "test",
      index: [9, 8]
    })
  );

  assert(err instanceof AggregateError);

  const expected = [
    { value: values[1], index: [9, 8, 1], cause: new Error("first err") },
    { value: values[3], index: [9, 8, 3], cause: new Error("second err") }
  ];
  let index = 0;

  for (const e of err.errors) {
    assert(e instanceof ResolveError);
    expect(e.message).toEqual("Validation error");
    expect(e.path).toEqual("test");
    expect(e).toEqual(expect.objectContaining(expected[index]));
    index++;
  }
});

test("should throw ResolveError when validate throws an async error", async () => {
  await expect(
    resolve({
      foo: "bar",
      async validate() {
        throw new Error("err");
      }
    })
  ).rejects.toThrowWithMessage(ResolveError, "Validation error");
});

test("should not call validate when validate = false", async () => {
  const validate = jest.fn();

  await expect(
    resolve(
      {
        foo: "bar",
        validate
      },
      { validate: false }
    )
  ).resolves.toBeTruthy();
  expect(validate).not.toHaveBeenCalled();
});

test("set path and index", async () => {
  await expect(
    resolve([{ a: "b" }, { c: "d" }], { path: "foo", index: [9, 8] })
  ).resolves.toEqual([
    { path: "foo", index: [9, 8, 0], data: { a: "b" } },
    { path: "foo", index: [9, 8, 1], data: { c: "d" } }
  ]);
});

test("should stop on the first error when bail = true", async () => {
  const values = [
    { a: "b" },
    {
      c: "d",
      validate() {
        throw new Error("first err");
      }
    },
    { e: "f" },
    {
      g: "h",
      validate() {
        throw new Error("second err");
      }
    },
    { i: "j" }
  ];
  const err = await getRejectedValue(resolve(values, { bail: true }));

  assert(err instanceof ResolveError);
  expect(err.message).toEqual("Validation error");
  expect(err.value).toEqual(values[1]);
  expect(err.cause).toEqual(new Error("first err"));
});
