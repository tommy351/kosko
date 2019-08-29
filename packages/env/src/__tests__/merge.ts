import { merge } from "../merge";

it("works", () => {
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
