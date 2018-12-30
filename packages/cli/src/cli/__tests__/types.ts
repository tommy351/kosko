import { getAliases, WithAlias } from "../types";

describe("getAliases", () => {
  let input: WithAlias;
  let result: string[];

  beforeEach(() => {
    result = getAliases(input);
  });

  describe("undefined", () => {
    beforeAll(() => (input = {}));
    test("should return an empty array", () => expect(result).toEqual([]));
  });

  describe("string", () => {
    beforeAll(() => (input = { alias: "foo" }));
    test("should return an empty array", () => expect(result).toEqual(["foo"]));
  });

  describe("string[]", () => {
    beforeAll(() => (input = { alias: ["foo", "bar"] }));
    test("should return an empty array", () =>
      expect(result).toEqual(["foo", "bar"]));
  });
});
