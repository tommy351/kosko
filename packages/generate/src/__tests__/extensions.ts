import { getExtensions } from "../extensions";

jest.mock("../requireExtensions", () => ({
  ".js": {},
  ".json": {}
}));

test("should return extensions", () => {
  expect(getExtensions()).toEqual(["js", "json"]);
});
