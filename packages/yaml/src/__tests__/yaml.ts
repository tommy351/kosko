import { parse } from "../yaml";

test.each([
  // YAML 1.1
  { input: "0123", expected: 83 },
  // YAML 1.2
  { input: "0o123", expected: 83 },
  // Decimal
  { input: "123", expected: 123 },
  // String
  { input: `"0123"`, expected: "0123" },
  // YAML 1.1 in key
  { input: "0123: value", expected: { 83: "value" } },
  // YAML 1.2 in key
  { input: "0o123: value", expected: { 83: "value" } }
])("octal number: $input -> $expected", ({ input, expected }) => {
  expect(parse(input)).toEqual([expected]);
});

test.each([
  // Yes
  { input: "yes", expected: true },
  { input: "Yes", expected: true },
  { input: "YES", expected: true },
  // No
  { input: "no", expected: false },
  { input: "No", expected: false },
  { input: "NO", expected: false },
  // On
  { input: "on", expected: true },
  { input: "On", expected: true },
  { input: "ON", expected: true },
  // Off
  { input: "off", expected: false },
  { input: "Off", expected: false },
  { input: "OFF", expected: false },
  // Y
  { input: "y", expected: true },
  { input: "Y", expected: true },
  // N
  { input: "n", expected: false },
  { input: "N", expected: false },
  // Yes in key
  { input: "yes: value", expected: { true: "value" } },
  // No in key
  { input: "no: value", expected: { false: "value" } },
  // Yes in value
  { input: "key: yes", expected: { key: true } },
  // No in value
  { input: "key: no", expected: { key: false } }
])("boolean: $input -> $expected", ({ input, expected }) => {
  expect(parse(input)).toEqual([expected]);
});

test("anchor", () => {
  expect(
    parse(`
a: &anchor
  foo: bar
b: *anchor
`)
  ).toEqual([{ a: { foo: "bar" }, b: { foo: "bar" } }]);
});

test("map merging", () => {
  expect(
    parse(`
a: &src-a
  a: 1
b: &src-b
  b: 2
result:
  <<: [*src-a, *src-b]
`)
  ).toEqual([{ a: { a: 1 }, b: { b: 2 }, result: { a: 1, b: 2 } }]);
});
