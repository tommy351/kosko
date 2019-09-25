import { formatPath } from "../paths";

test("works", () => {
  expect(formatPath("a/#{b}/c/#{d}", { b: "foo", d: "bar" })).toEqual(
    "a/foo/c/bar"
  );
});
