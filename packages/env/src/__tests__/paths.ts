import { formatPath } from "../paths";

test("should replace string with input", () => {
  expect(formatPath("a/#{b}/c/#{d}", { b: "foo", d: "bar" })).toEqual(
    "a/foo/c/bar"
  );
});

test("should not replace string when the key does not exist", () => {
  expect(formatPath("a/#{foo}/c", { bar: "a" })).toEqual("a/#{foo}/c");
});
