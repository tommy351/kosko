/// <reference types="jest-extended" />
import { getRejectedValue, sleep } from "@kosko/test-utils";
import assert from "node:assert";
import { ResolveError } from "../error";
import { ResolveOptions, resolve } from "../resolve";
import { ValidationError } from "ajv";

test("value is an object", async () => {
  await expect(resolve({ foo: "bar" })).resolves.toEqual([
    { path: "", index: [], issues: [], data: { foo: "bar" } }
  ]);
});

test("value is an array", async () => {
  await expect(resolve([{ a: "b" }, { c: "d" }])).resolves.toEqual([
    { path: "", index: [0], issues: [], data: { a: "b" } },
    { path: "", index: [1], issues: [], data: { c: "d" } }
  ]);
});

test("value is a function that returns an object", async () => {
  await expect(resolve(() => ({ foo: "bar" }))).resolves.toEqual([
    { path: "", index: [], issues: [], data: { foo: "bar" } }
  ]);
});

test("value is a function that returns an array", async () => {
  await expect(resolve(() => [{ a: "b" }, { c: "d" }])).resolves.toEqual([
    { path: "", index: [0], issues: [], data: { a: "b" } },
    { path: "", index: [1], issues: [], data: { c: "d" } }
  ]);
});

test("value is a function that returns a Promise", async () => {
  await expect(resolve(async () => ({ foo: "bar" }))).resolves.toEqual([
    { path: "", index: [], issues: [], data: { foo: "bar" } }
  ]);
});

describe("when value is a function that throws an error", () => {
  const value = () => {
    throw new Error("err");
  };

  test("should add an issue", async () => {
    await expect(
      resolve(value, {
        path: "test",
        index: [5]
      })
    ).resolves.toEqual([
      {
        path: "test",
        index: [5],
        data: value,
        issues: [
          {
            severity: "error",
            message: "Input function value threw an error",
            cause: new Error("err")
          }
        ]
      }
    ]);
  });

  test("should throw ResolveError when throwOnError = true", async () => {
    const err = await getRejectedValue(
      resolve(value, { path: "test", index: [5], throwOnError: true })
    );

    assert(err instanceof ResolveError);
    expect(err.message).toEqual("Input function value threw an error");
    expect(err.path).toEqual("test");
    expect(err.index).toEqual([5]);
    expect(err.value).toEqual(value);
    expect(err.cause).toEqual(new Error("err"));
  });
});

describe("when value is a function that returns a rejected promise", () => {
  const value = () => Promise.reject(new Error("err"));

  test("should add an issue", async () => {
    await expect(resolve(value, { path: "test", index: [5] })).resolves.toEqual(
      [
        {
          path: "test",
          index: [5],
          data: value,
          issues: [
            {
              severity: "error",
              message: "Input function value threw an error",
              cause: new Error("err")
            }
          ]
        }
      ]
    );
  });

  test("should throw ResolveError when throwOnError = true", async () => {
    const err = await getRejectedValue(
      resolve(value, {
        path: "test",
        index: [5],
        throwOnError: true
      })
    );

    assert(err instanceof ResolveError);
    expect(err.message).toEqual("Input function value threw an error");
    expect(err.path).toEqual("test");
    expect(err.index).toEqual([5]);
    expect(err.value).toEqual(value);
    expect(err.cause).toEqual(new Error("err"));
  });
});

test("value is a resolved Promise", async () => {
  await expect(resolve(Promise.resolve({ foo: "bar" }))).resolves.toEqual([
    { path: "", index: [], issues: [], data: { foo: "bar" } }
  ]);
});

describe("when value is a rejected promise", () => {
  const value = Promise.reject(new Error("err"));

  test("should add an issue", async () => {
    await expect(resolve(value, { path: "test", index: [5] })).resolves.toEqual(
      [
        {
          path: "test",
          index: [5],
          data: value,
          issues: [
            {
              severity: "error",
              message: "Input promise value rejected",
              cause: new Error("err")
            }
          ]
        }
      ]
    );
  });

  test("should throw ResolveError when throwOnError = true", async () => {
    const err = await getRejectedValue(
      resolve(value, { path: "test", index: [5], throwOnError: true })
    );

    assert(err instanceof ResolveError);
    expect(err.message).toEqual("Input promise value rejected");
    expect(err.path).toEqual("test");
    expect(err.index).toEqual([5]);
    expect(err.value).toEqual(value);
    expect(err.cause).toEqual(new Error("err"));
  });
});

test("value is a Set", async () => {
  await expect(resolve(new Set([{ a: "b" }, { c: "d" }]))).resolves.toEqual([
    { path: "", index: [0], issues: [], data: { a: "b" } },
    { path: "", index: [1], issues: [], data: { c: "d" } }
  ]);
});

test("value is a generator function", async () => {
  function* value() {
    yield { a: "b" };
    yield { c: "d" };
  }

  await expect(resolve(value)).resolves.toEqual([
    { path: "", index: [0], issues: [], data: { a: "b" } },
    { path: "", index: [1], issues: [], data: { c: "d" } }
  ]);
});

describe("when value is a generator function that throws an error", () => {
  function* value() {
    yield { a: "b" };
    throw new Error("err");
  }

  test("should add an issue", async () => {
    const result = await resolve(value, {
      path: "test",
      index: [5]
    });

    expect(result).toHaveLength(1);
    expect(result[0].path).toEqual("test");
    expect(result[0].index).toEqual([5]);
    expect(result[0].issues).toEqual([
      {
        severity: "error",
        message: "Input iterable value threw an error",
        cause: new Error("err")
      }
    ]);
  });

  test("should throws a ResolveError when throwOnError = true", async () => {
    const err = await getRejectedValue(
      resolve(value, {
        path: "test",
        index: [5],
        throwOnError: true
      })
    );

    assert(err instanceof ResolveError);
    expect(err.message).toEqual("Input iterable value threw an error");
    expect(err.path).toEqual("test");
    expect(err.index).toEqual([5]);
    expect(err.cause).toEqual(new Error("err"));
    // TODO: Assert `err.value`
  });
});

test("value is an async generator function", async () => {
  async function* value() {
    yield { a: "b" };
    yield { c: "d" };
  }

  await expect(resolve(value)).resolves.toEqual([
    { path: "", index: [0], issues: [], data: { a: "b" } },
    { path: "", index: [1], issues: [], data: { c: "d" } }
  ]);
});

describe("when value is an async generator function that throws an error", () => {
  async function* value() {
    yield { a: "b" };
    throw new Error("err");
  }

  test("should add an issue", async () => {
    const result = await resolve(value, {
      path: "test",
      index: [5]
    });

    expect(result).toHaveLength(1);
    expect(result[0].path).toEqual("test");
    expect(result[0].index).toEqual([5]);
    expect(result[0].issues).toEqual([
      {
        severity: "error",
        message: "Input async iterable value threw an error",
        cause: new Error("err")
      }
    ]);
  });

  test("should throw a ResolveError when throwOnError = true", async () => {
    async function* value() {
      yield { a: "b" };
      throw new Error("err");
    }

    const err = await getRejectedValue(
      resolve(value, {
        path: "test",
        index: [5],
        throwOnError: true
      })
    );

    assert(err instanceof ResolveError);
    expect(err.message).toEqual("Input async iterable value threw an error");
    expect(err.path).toEqual("test");
    expect(err.index).toEqual([5]);
    expect(err.cause).toEqual(new Error("err"));
    // TODO: Assert `err.value`
  });
});

test("value is undefined", async () => {
  await expect(resolve(undefined)).resolves.toEqual([
    { path: "", index: [], issues: [], data: undefined }
  ]);
});

test("value is null", async () => {
  await expect(resolve(null)).resolves.toEqual([
    { path: "", index: [], issues: [], data: null }
  ]);
});

test("value is a string", async () => {
  await expect(resolve("foo")).resolves.toEqual([
    { path: "", index: [], issues: [], data: "foo" }
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
    { path: "", index: [0], issues: [], data: { a: 1 } },
    { path: "", index: [1], issues: [], data: { b: 2 } },
    { path: "", index: [2, 0], issues: [], data: { c: 3 } },
    { path: "", index: [2, 1], issues: [], data: { d: 4 } },
    { path: "", index: [3], issues: [], data: { e: 5 } },
    { path: "", index: [4, 0], issues: [], data: { f: 6 } },
    { path: "", index: [4, 1], issues: [], data: { g: 7 } }
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

describe("when validate method throws an error", () => {
  const value = {
    c: "d",
    validate() {
      throw new Error("err");
    }
  };

  test("should add an issue", async () => {
    await expect(resolve(value, { path: "test", index: [5] })).resolves.toEqual(
      [
        {
          path: "test",
          index: [5],
          data: value,
          issues: [
            {
              severity: "error",
              message: "Validation error",
              cause: new Error("err")
            }
          ]
        }
      ]
    );
  });

  test("should throw a ResolveError when throwOnError = true", async () => {
    const err = await getRejectedValue(
      resolve(value, { path: "test", index: [5], throwOnError: true })
    );

    assert(err instanceof ResolveError);
    expect(err.message).toEqual("Validation error");
    expect(err.path).toEqual("test");
    expect(err.index).toEqual([5]);
    expect(err.value).toEqual(value);
    expect(err.cause).toEqual(new Error("err"));
  });
});

describe("when validate returns a rejected promise", () => {
  const value = {
    foo: "bar",
    validate() {
      return Promise.reject(new Error("err"));
    }
  };

  test("should add an issue", async () => {
    await expect(resolve(value, { path: "test", index: [5] })).resolves.toEqual(
      [
        {
          path: "test",
          index: [5],
          data: value,
          issues: [
            {
              severity: "error",
              message: "Validation error",
              cause: new Error("err")
            }
          ]
        }
      ]
    );
  });

  test("should throw a ResolveError when throwOnError = true", async () => {
    const err = await getRejectedValue(
      resolve(value, { path: "test", index: [5], throwOnError: true })
    );

    assert(err instanceof ResolveError);
    expect(err.message).toEqual("Validation error");
    expect(err.path).toEqual("test");
    expect(err.index).toEqual([5]);
    expect(err.value).toEqual(value);
    expect(err.cause).toEqual(new Error("err"));
  });
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
    { path: "foo", index: [9, 8, 0], issues: [], data: { a: "b" } },
    { path: "foo", index: [9, 8, 1], issues: [], data: { c: "d" } }
  ]);
});

describe("when multiple validation errors occur", () => {
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
      async validate() {
        // Wait for a while to make sure the validation result will return
        // after the first one
        await sleep(10);
        throw new Error("second err");
      }
    },
    { i: "j" }
  ];

  test("should add issues", async () => {
    await expect(resolve(values)).resolves.toEqual([
      { path: "", index: [0], issues: [], data: values[0] },
      {
        path: "",
        index: [1],
        issues: [
          {
            severity: "error",
            message: "Validation error",
            cause: new Error("first err")
          }
        ],
        data: values[1]
      },
      { path: "", index: [2], issues: [], data: values[2] },
      {
        path: "",
        index: [3],
        issues: [
          {
            severity: "error",
            message: "Validation error",
            cause: new Error("second err")
          }
        ],
        data: values[3]
      },
      { path: "", index: [4], issues: [], data: values[4] }
    ]);
  });

  test("should stop on the first error when bail = true", async () => {
    await expect(resolve(values, { bail: true })).resolves.toEqual([
      { path: "", index: [0], issues: [], data: values[0] },
      {
        path: "",
        index: [1],
        issues: [
          {
            severity: "error",
            message: "Validation error",
            cause: new Error("first err")
          }
        ],
        data: values[1]
      },
      { path: "", index: [2], issues: [], data: values[2] },
      { path: "", index: [4], issues: [], data: values[4] }
    ]);
  });

  test("should throw an AggregateError when throwOnError = true", async () => {
    const err = await getRejectedValue(
      resolve(values, { path: "test", index: [9, 8], throwOnError: true })
    );

    assert(err instanceof AggregateError);

    const expected = [
      { value: values[1], index: [9, 8, 1], cause: new Error("first err") },
      { value: values[3], index: [9, 8, 3], cause: new Error("second err") }
    ];

    expect(err.errors).toHaveLength(expected.length);

    for (let index = 0; index < expected.length; index++) {
      const actual = err.errors[index];

      assert(actual instanceof ResolveError);
      expect(actual.message).toEqual("Validation error");
      expect(actual.path).toEqual("test");
      expect(actual).toEqual(expect.objectContaining(expected[index]));
    }
  });

  test("should throw the first error when bail = true and throwOnError = true", async () => {
    const err = await getRejectedValue(
      resolve(values, { bail: true, throwOnError: true })
    );

    assert(err instanceof ResolveError);
    expect(err.message).toEqual("Validation error");
    expect(err.value).toEqual(values[1]);
    expect(err.cause).toEqual(new Error("first err"));
  });
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
      { path: "", index: [0], issues: [], data: { a: 1 } },
      { path: "", index: [1], issues: [], data: { b: 2 } },
      { path: "", index: [2, 0], issues: [], data: { c: 3 } },
      { path: "", index: [2, 1], issues: [], data: { d: 4 } },
      { path: "", index: [3], issues: [], data: { e: 5 } },
      { path: "", index: [4, 0], issues: [], data: { f: 6 } },
      { path: "", index: [4, 1], issues: [], data: { g: 7 } }
    ]);
  });
});

test("transform a manifest", async () => {
  const transform = jest.fn((manifest) => (manifest.data as number) + 1);

  await expect(
    resolve(1, { path: "foo", index: [5], transform })
  ).resolves.toEqual([{ path: "foo", index: [5], issues: [], data: 2 }]);
  expect(transform).toHaveBeenCalledWith({
    path: "foo",
    index: [5],
    issues: [],
    data: 1
  });
  expect(transform).toHaveBeenCalledOnce();
});

test("transform multiple manifests", async () => {
  await expect(
    resolve([1, 2, 3], {
      transform: (manifest) => (manifest.data as number) + 1
    })
  ).resolves.toEqual([
    { path: "", index: [0], issues: [], data: 2 },
    { path: "", index: [1], issues: [], data: 3 },
    { path: "", index: [2], issues: [], data: 4 }
  ]);
});

test("transform returns a Promise", async () => {
  await expect(
    resolve(1, {
      transform: async (manifest) => (manifest.data as number) + 1
    })
  ).resolves.toEqual([{ path: "", index: [], issues: [], data: 2 }]);
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

test("should add an issue when the transform function throws an error", async () => {
  const cause = new Error("err");

  await expect(
    resolve(1, {
      path: "test",
      index: [5],
      transform: () => {
        throw cause;
      }
    })
  ).resolves.toEqual([
    {
      path: "test",
      index: [5],
      data: 1,
      issues: [
        {
          severity: "error",
          message: "An error occurred in transform function",
          cause
        }
      ]
    }
  ]);
});

test("should throw ResolveError when the transform function throws an error and throwOnError = true", async () => {
  const cause = new Error("err");
  const err = await getRejectedValue(
    resolve(1, {
      path: "test",
      index: [5],
      throwOnError: true,
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

test("should not run validate method when transform fails", async () => {
  const value = {
    validate: jest.fn()
  };

  await expect(
    resolve(value, {
      transform() {
        throw new Error("err");
      }
    })
  ).resolves.toEqual([
    {
      path: "",
      index: [],
      data: value,
      issues: [
        {
          severity: "error",
          message: "An error occurred in transform function",
          cause: new Error("err")
        }
      ]
    }
  ]);
  expect(value.validate).not.toHaveBeenCalled();
});

test("when validateManifest does not report any issue", async () => {
  const value = { foo: "bar" };

  await expect(resolve(value, { validateManifest: () => {} })).resolves.toEqual(
    [{ path: "", index: [], issues: [], data: value }]
  );
});

test("when validateManifest reports a warning", async () => {
  const value = { foo: "bar" };

  await expect(
    resolve(value, {
      path: "test",
      index: [5],
      validateManifest(manifest) {
        manifest.report({
          severity: "warning",
          message: "test warning",
          cause: new Error("err")
        });
      }
    })
  ).resolves.toEqual([
    {
      path: "test",
      index: [5],
      data: value,
      issues: [
        {
          severity: "warning",
          message: "test warning",
          cause: new Error("err")
        }
      ]
    }
  ]);
});

describe("when validateManifest reports an error", () => {
  const value = { foo: "bar" };
  const options: ResolveOptions = {
    path: "test",
    index: [5],
    validateManifest(manifest) {
      manifest.report({
        severity: "error",
        message: "test error",
        cause: new Error("err")
      });
    }
  };

  test("should add an issue", async () => {
    await expect(resolve(value, options)).resolves.toEqual([
      {
        path: options.path,
        index: options.index,
        data: value,
        issues: [
          {
            severity: "error",
            message: "test error",
            cause: new Error("err")
          }
        ]
      }
    ]);
  });

  test("should throw an error when throwOnError = true", async () => {
    const err = await getRejectedValue(
      resolve(value, { ...options, throwOnError: true })
    );

    assert(err instanceof ResolveError);
    expect(err.message).toEqual("test error");
    expect(err.path).toEqual(options.path);
    expect(err.index).toEqual(options.index);
    expect(err.value).toEqual(value);
    expect(err.cause).toEqual(new ResolveError("err"));
  });
});

describe("when validateManifest reports a warning, an error, then a warning", () => {
  const value = { foo: "bar" };
  const options: ResolveOptions = {
    path: "test",
    index: [5],
    validateManifest(manifest) {
      manifest.report({
        severity: "warning",
        message: "warning one",
        cause: new Error("warning 1")
      });
      manifest.report({
        severity: "error",
        message: "error one",
        cause: new Error("error 1")
      });
      manifest.report({
        severity: "warning",
        message: "warning two",
        cause: new Error("warning 2")
      });
    }
  };

  test("should add issues", async () => {
    await expect(resolve(value, options)).resolves.toEqual([
      {
        path: options.path,
        index: options.index,
        data: value,
        issues: [
          {
            severity: "warning",
            message: "warning one",
            cause: new Error("warning 1")
          },
          {
            severity: "error",
            message: "error one",
            cause: new Error("error 1")
          },
          {
            severity: "warning",
            message: "warning two",
            cause: new Error("warning 2")
          }
        ]
      }
    ]);
  });

  test("should throw an error when throwOnError = true", async () => {
    const err = await getRejectedValue(
      resolve(value, { ...options, throwOnError: true })
    );

    assert(err instanceof ResolveError);
    expect(err.message).toEqual("error one");
    expect(err.path).toEqual(options.path);
    expect(err.index).toEqual(options.index);
    expect(err.value).toEqual(value);
    expect(err.cause).toEqual(new ResolveError("error 1"));
  });

  test("should stop on the first error when bail = true", async () => {
    await expect(resolve(value, { ...options, bail: true })).resolves.toEqual([
      {
        path: options.path,
        index: options.index,
        data: value,
        issues: [
          {
            severity: "warning",
            message: "warning one",
            cause: new Error("warning 1")
          },
          {
            severity: "error",
            message: "error one",
            cause: new Error("error 1")
          }
        ]
      }
    ]);
  });
});

test("when validateManifest is an async function", async () => {
  const value = { foo: "bar" };

  await expect(
    resolve(value, {
      path: "test",
      index: [5],
      async validateManifest(manifest) {
        manifest.report({
          severity: "error",
          message: "test error",
          cause: new Error("err")
        });
      }
    })
  ).resolves.toEqual([
    {
      path: "test",
      index: [5],
      data: value,
      issues: [
        {
          severity: "error",
          message: "test error",
          cause: new Error("err")
        }
      ]
    }
  ]);
});

test("when validateManifest is defined but validate = false", async () => {
  const validateManifest = jest.fn();

  await expect(
    resolve({ foo: "bar" }, { validate: false, validateManifest })
  ).resolves.toEqual([
    { path: "", index: [], issues: [], data: { foo: "bar" } }
  ]);
  expect(validateManifest).not.toHaveBeenCalled();
});

describe("when validateManifest throws an error", () => {
  const value = { foo: "bar" };
  const options: ResolveOptions = {
    path: "test",
    index: [5],
    validateManifest() {
      throw new Error("err");
    }
  };

  test("should add an issue", async () => {
    await expect(resolve(value, options)).resolves.toEqual([
      {
        path: options.path,
        index: options.index,
        data: value,
        issues: [
          {
            severity: "error",
            message: "An error occurred in validateManifest function",
            cause: new Error("err")
          }
        ]
      }
    ]);
  });

  test("should throw an error when throwOnError = true", async () => {
    const err = await getRejectedValue(
      resolve(value, { ...options, throwOnError: true })
    );

    assert(err instanceof ResolveError);
    expect(err.message).toEqual(
      "An error occurred in validateManifest function"
    );
    expect(err.path).toEqual(options.path);
    expect(err.index).toEqual(options.index);
    expect(err.value).toEqual(value);
    expect(err.cause).toEqual(new Error("err"));
  });
});

test("when validateManifest reports an issue without a cause", async () => {
  const value = { foo: "bar" };

  await expect(
    resolve(value, {
      path: "test",
      index: [5],
      validateManifest(manifest) {
        manifest.report({
          severity: "error",
          message: "test error"
        });
      },
      throwOnError: false
    })
  ).resolves.toEqual([
    {
      path: "test",
      index: [5],
      data: value,
      issues: [
        {
          severity: "error",
          message: "test error"
        }
      ]
    }
  ]);
});

test("when validateManifest is called on multiple values", async () => {
  await expect(
    resolve([1, 2, 3], {
      validateManifest(manifest) {
        if ((manifest.data as number) % 2) {
          manifest.report({
            severity: "error",
            message: `test error ${manifest.data}`
          });
        }
      }
    })
  ).resolves.toEqual([
    {
      path: "",
      index: [0],
      issues: [{ severity: "error", message: "test error 1" }],
      data: 1
    },
    {
      path: "",
      index: [1],
      data: 2,
      issues: []
    },
    {
      path: "",
      index: [2],
      issues: [{ severity: "error", message: "test error 3" }],
      data: 3
    }
  ]);
});

describe("when validate method throws an ajv validation error", () => {
  const err = new ValidationError([
    { instancePath: "foo.a", message: "is required" },
    {
      instancePath: "foo.b",
      keyword: "enum",
      message: "must be one of",
      params: { allowedValues: ["a", "b", "c"] }
    }
  ]);
  const value = {
    validate() {
      throw err;
    }
  };

  test("should add issues", async () => {
    await expect(resolve(value)).resolves.toEqual([
      {
        path: "",
        index: [],
        data: value,
        issues: [
          {
            severity: "error",
            message: "foo.a is required"
          },
          {
            severity: "error",
            message: `foo.b must be one of: ["a","b","c"]`
          }
        ]
      }
    ]);
  });

  test("should keep the original error when keepAjvErrors = true", async () => {
    await expect(resolve(value, { keepAjvErrors: true })).resolves.toEqual([
      {
        path: "",
        index: [],
        data: value,
        issues: [
          {
            severity: "error",
            message: "Validation error",
            cause: err
          }
        ]
      }
    ]);
  });
});
