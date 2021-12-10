import { booleanArg, stringArg, stringArrayArg } from "../arg";

describe.each([
  [undefined, []],
  [true, ["--foo"]],
  [false, []]
])("booleanArg - %p", (input, expected) => {
  test(`should return ${JSON.stringify(expected)}`, () => {
    expect(booleanArg("foo", input)).toEqual(expected);
  });
});

describe.each([
  [undefined, []],
  ["bar", ["--foo", "bar"]],
  ["", []]
])("stringArg - %p", (input, expected) => {
  test(`should return ${JSON.stringify(expected)}`, () => {
    expect(stringArg("foo", input)).toEqual(expected);
  });
});

describe.each([
  [undefined, []],
  [[], []],
  [["a"], ["--foo", "a"]],
  [
    ["a", "b"],
    ["--foo", "a", "--foo", "b"]
  ]
])("stringArrayArg - %p", (input, expected) => {
  test(`should return ${JSON.stringify(expected)}`, () => {
    expect(stringArrayArg("foo", input)).toEqual(expected);
  });
});
