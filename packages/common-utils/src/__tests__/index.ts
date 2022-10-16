import { getErrorCode, isRecord, toArray } from "../index";

class Empty {}

test.each([
  { value: null, expected: false },
  { value: undefined, expected: false },
  { value: {}, expected: true },
  { value: Object.create(null), expected: true },
  {
    value: () => {
      //
    },
    expected: false
  },
  { value: [], expected: false },
  { value: "", expected: false },
  { value: true, expected: false },
  { value: 3, expected: false },
  { value: Empty, expected: false },
  { value: new Empty(), expected: true }
])("isRecord($value) -> $expected", ({ value, expected }) => {
  expect(isRecord(value)).toEqual(expected);
});

test.each([
  { value: 1, expected: [1] },
  { value: [1], expected: [1] }
])("toArray($value) -> $expected", ({ value, expected }) => {
  expect(toArray(value)).toEqual(expected);
});

test.each([
  { value: undefined, expected: undefined },
  { value: null, expected: undefined },
  { value: "", expected: undefined },
  { value: 3, expected: undefined },
  { value: true, expected: undefined },
  { value: {}, expected: undefined },
  { value: [], expected: undefined },
  { value: { foo: "bar" }, expected: undefined },
  { value: { code: "foo" }, expected: "foo" },
  { value: { code: 3 }, expected: undefined }
])("getErrorCode($value) -> $expected", ({ value, expected }) => {
  expect(getErrorCode(value)).toEqual(expected);
});
