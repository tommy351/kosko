import { merge } from "../merge";

describe("nested objects", () => {
  it("should merge objects", () => {
    const actual = merge(
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
    );

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
  it("should override the value", () => {
    const actual = merge({ a: [1] }, { a: [2] });
    expect(actual).toEqual({ a: [2] });
  });
});

describe("non-plain objects", () => {
  class Props {
    constructor(props: any) {
      for (const key of Object.keys(props)) {
        (this as any)[key] = props[key];
      }
    }
  }

  it("should override the value", () => {
    const actual = merge(
      {
        a: new Props({ foo: 1, bar: 2 })
      },
      {
        a: new Props({ foo: 3 })
      }
    );

    expect(actual).toEqual({ a: new Props({ foo: 3 }) });
  });
});

describe("rest parameters", () => {
  it("should merge them all", () => {
    const actual = merge({ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 });

    expect(actual).toEqual({
      a: 1,
      b: 2,
      c: 3,
      d: 4
    });
  });
});
