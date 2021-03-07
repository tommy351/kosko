import { reduce, reduceAsync } from "../reduce";

describe("reduce", () => {
  test("should reduce values", () => {
    const result = reduce(
      [
        {
          name: "a",
          reduce: (target, name) => ({
            ...target,
            a: name
          })
        },
        {
          name: "b",
          reduce: (target, name) => ({
            ...target,
            b: name
          })
        }
      ],
      "foo"
    );

    expect(result).toEqual({
      a: "foo",
      b: "foo"
    });
  });
});

describe("reduceAsync", () => {
  test("should reduce values", async () => {
    const result = reduceAsync(
      [
        {
          name: "sync",
          reduce: (target, name) => ({
            ...target,
            sync: name
          })
        },
        {
          name: "async",
          reduce: async (target, name) => ({
            ...target,
            async: name
          })
        }
      ],
      "foo"
    );

    await expect(result).resolves.toEqual({
      sync: "foo",
      async: "foo"
    });
  });

  test("should throw error when reducer rejects", async () => {
    const result = reduceAsync([
      {
        name: "error",
        reduce: () => Promise.reject(new Error("error"))
      }
    ]);

    await expect(result).rejects.toThrow();
  });
});
