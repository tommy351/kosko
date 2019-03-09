import { resolve } from "../resolve";
import { join } from "path";

describe("given id", () => {
  describe("and the module exists", () => {
    test("should returns the result", async () => {
      const result = await resolve("fs");
      expect(result).toEqual("fs");
    });
  });

  describe("and the module does not exist", () => {
    test("should throw an error", async () => {
      await expect(resolve("fake")).rejects.toThrow();
    });
  });
});

describe("given basedir", () => {
  test("should find in basedir", async () => {
    const result = await resolve("resolve", {
      basedir: join(__dirname, "../..")
    });
    expect(result).toEqual(require.resolve("resolve"));
  });
});
