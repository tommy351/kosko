/// <reference types="jest-extended" />
import { getRejectedValue } from "@kosko/test-utils";
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
  expect(err.message).toEqual("Input function value threw an error");
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
  expect(err.message).toEqual("Input function value threw an error");
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
  expect(err.message).toEqual("Input iterable value threw an error");
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
  expect(err.message).toEqual("Input async iterable value threw an error");
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

test("throws error if concurrency < 1", async () => {
  await expect(resolve({}, { concurrency: 0 })).rejects.toThrow(
    "Concurrency must be greater than 0"
  );
});

describe("when concurrency = 1", () => {
  test("value is nested", async () => {
    await expect(
      resolve(
        [
          { a: 1 },
          // Returns an object
          () => ({ b: 2 }),
          // Returns an array
          () => [{ c: 3 }, { d: 4 }],
          // Returns an promise
          async () => ({ e: 5 }),
          // Returns an promise returning an array
          async () => [{ f: 6 }, { g: 7 }]
        ],
        { concurrency: 1 }
      )
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
});

test("transform a manifest", async () => {
  const transform = jest.fn((manifest) => (manifest.data as number) + 1);

  await expect(
    resolve(1, { path: "foo", index: [5], transform })
  ).resolves.toEqual([{ path: "foo", index: [5], data: 2 }]);
  expect(transform).toHaveBeenCalledWith({ path: "foo", index: [5], data: 1 });
  expect(transform).toHaveBeenCalledOnce();
});

test("transform multiple manifests", async () => {
  await expect(
    resolve([1, 2, 3], {
      transform: (manifest) => (manifest.data as number) + 1
    })
  ).resolves.toEqual([
    { path: "", index: [0], data: 2 },
    { path: "", index: [1], data: 3 },
    { path: "", index: [2], data: 4 }
  ]);
});

test("transform returns a Promise", async () => {
  await expect(
    resolve(1, {
      transform: async (manifest) => (manifest.data as number) + 1
    })
  ).resolves.toEqual([{ path: "", index: [], data: 2 }]);
});

test("transform returns null", async () => {
  await expect(
    resolve(1, {
      transform: () => null
    })
  ).resolves.toEqual([]);
});

test("transform returns undefined", async () => {
  await expect(
    resolve(1, {
      transform: () => undefined
    })
  ).resolves.toEqual([]);
});

test("should throw ResolveError when the transform function throws an error", async () => {
  const cause = new Error("err");
  const err = await getRejectedValue(
    resolve(1, {
      path: "test",
      index: [5],
      transform: () => {
        throw cause;
      }
    })
  );

  assert(err instanceof ResolveError);
  expect(err.message).toEqual("An error occurred in transform function");
  expect(err.path).toEqual("test");
  expect(err.index).toEqual([5]);
  expect(err.cause).toEqual(cause);
  expect(err.value).toEqual(1);
});

test("should call afterValidate when validate method is implemented", async () => {
  const data = {
    validate: jest.fn()
  };
  const afterValidate = jest.fn();

  await resolve(data, { path: "test", index: [5], afterValidate });
  expect(data.validate).toHaveBeenCalled();
  expect(data.validate).toHaveBeenCalledOnce();
  expect(afterValidate).toHaveBeenCalled();
  expect(afterValidate).toHaveBeenCalledOnce();
  expect(afterValidate).toHaveBeenCalledWith({
    path: "test",
    index: [5],
    data
  });
  expect(afterValidate).toHaveBeenCalledAfter(data.validate);
});

test("should call afterValidate when validate method is not implemented", async () => {
  const data = { foo: "bar" };
  const afterValidate = jest.fn();

  await resolve(data, { path: "test", index: [5], afterValidate });
  expect(afterValidate).toHaveBeenCalled();
  expect(afterValidate).toHaveBeenCalledOnce();
  expect(afterValidate).toHaveBeenCalledWith({
    path: "test",
    index: [5],
    data
  });
});

test("should not call afterValidate when validate = false", async () => {
  const afterValidate = jest.fn();

  await resolve({}, { afterValidate, validate: false });
  expect(afterValidate).not.toHaveBeenCalled();
});

test("should not call afterValidate when validation fails", async () => {
  const afterValidate = jest.fn();

  await expect(
    resolve(
      {
        validate() {
          throw new Error("err");
        }
      },
      { afterValidate }
    )
  ).rejects.toThrow();
  expect(afterValidate).not.toHaveBeenCalled();
});

test("afterValidate throws an error", async () => {
  const data = { foo: "bar" };
  const afterValidate = jest.fn(() => {
    throw new Error("err");
  });

  const err = await getRejectedValue(
    resolve(data, { afterValidate, path: "test", index: [5] })
  );

  assert(err instanceof ResolveError);
  expect(err.message).toEqual("An error occurred in afterValidate function");
  expect(err.path).toEqual("test");
  expect(err.index).toEqual([5]);
  expect(err.value).toEqual(data);
  expect(err.cause).toEqual(new Error("err"));
});

test("afterValidate returns a rejected promise", async () => {
  const data = { foo: "bar" };
  const afterValidate = jest.fn().mockRejectedValue(new Error("err"));

  const err = await getRejectedValue(
    resolve(data, { afterValidate, path: "test", index: [5] })
  );

  assert(err instanceof ResolveError);
  expect(err.message).toEqual("An error occurred in afterValidate function");
  expect(err.path).toEqual("test");
  expect(err.index).toEqual([5]);
  expect(err.value).toEqual(data);
  expect(err.cause).toEqual(new Error("err"));
});
