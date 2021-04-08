import { ValidationError } from "../error";
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
  await expect(
    resolve(() => {
      throw new Error("err");
    })
  ).rejects.toThrow();
});

test("value is an async function that throws an error", async () => {
  await expect(
    resolve(async () => {
      throw new Error("err");
    })
  ).rejects.toThrow();
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
  expect(validate).toBeCalledTimes(1);
});

test("should throw ValidationError when validate throws an error", async () => {
  await expect(
    resolve(
      [
        { a: "b" },
        {
          c: "d",
          validate() {
            throw new Error("err");
          }
        }
      ],
      { path: "x", index: [9, 8] }
    )
  ).rejects.toThrowError(
    new ValidationError({
      path: "x",
      index: [9, 8, 1],
      component: { c: "d" },
      cause: new Error("err")
    })
  );
});

test("should throw ValidationError when validate throws an async error", async () => {
  await expect(
    resolve({
      foo: "bar",
      async validate() {
        throw new Error("err");
      }
    })
  ).rejects.toThrowError(ValidationError);
});

test("should not call validate when validate=false", async () => {
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
  expect(validate).not.toBeCalled();
});

test("set path and index", async () => {
  await expect(
    resolve([{ a: "b" }, { c: "d" }], { path: "foo", index: [9, 8] })
  ).resolves.toEqual([
    { path: "foo", index: [9, 8, 0], data: { a: "b" } },
    { path: "foo", index: [9, 8, 1], data: { c: "d" } }
  ]);
});
