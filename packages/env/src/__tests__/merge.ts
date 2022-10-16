import { merge, mergeAsync } from "../merge";

describe("merge", () => {
  describe("nested objects", () => {
    test("should merge objects", () => {
      const actual = merge([
        {
          bar: 1,
          foo: {
            bar: 3
          }
        },
        {
          baz: 2,
          foo: {
            baz: 4
          }
        }
      ]);

      expect(actual).toEqual({
        bar: 1,
        baz: 2,
        foo: {
          bar: 3,
          baz: 4
        }
      });
    });
  });

  describe("array", () => {
    test("should override the value", () => {
      const actual = merge([{ a: [1] }, { a: [2] }]);
      expect(actual).toEqual({ a: [2] });
    });
  });

  describe("non-plain objects", () => {
    class Props {
      constructor(props: Record<string, unknown>) {
        Object.assign(this, props);
      }
    }

    test("should override the value", () => {
      const actual = merge([
        {
          a: new Props({ foo: 1, bar: 2 })
        },
        {
          a: new Props({ foo: 3 })
        }
      ]);

      expect(actual).toEqual({ a: new Props({ foo: 3 }) });
    });
  });

  describe("rest parameters", () => {
    test("should merge them all", () => {
      const actual = merge([{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }]);

      expect(actual).toEqual({
        a: 1,
        b: 2,
        c: 3,
        d: 4
      });
    });
  });
});

describe("mergeAsync", () => {
  test("should await promise and merge objects", async () => {
    await expect(
      mergeAsync([Promise.resolve({ bar: 1 }), Promise.resolve({ baz: 2 })])
    ).resolves.toEqual({ bar: 1, baz: 2 });
  });

  test("should throw error when promise rejects", async () => {
    await expect(
      mergeAsync([Promise.reject(new Error("error"))])
    ).rejects.toThrow();
  });
});
