import { compileNamespacedNamePattern } from "./manifest";

describe("compileNamespacedNamePattern", () => {
  describe("when namespace is undefined", () => {
    test.each([
      { name: "abc", expected: true },
      { name: "cba", expected: false },
      { name: "abc", namespace: "a", expected: false },
      { name: "abc", namespace: "", expected: false }
    ])(
      "return $expected when name = $name, namespace = $namespace",
      ({ name, namespace, expected }) => {
        const match = compileNamespacedNamePattern({ name: "ab*" });
        expect(match({ name, namespace })).toEqual(expected);
      }
    );
  });

  describe("when namespace is defined", () => {
    test.each([
      { name: "abc", expected: false },
      { name: "cba", expected: false },
      { name: "abc", namespace: "xyz", expected: true },
      { name: "abc", namespace: "zyx", expected: false },
      { name: "cba", namespace: "xyz", expected: false },
      { name: "abc", namespace: "", expected: false }
    ])(
      "return $expected when name = $name, namespace = $namespace",
      ({ name, namespace, expected }) => {
        const match = compileNamespacedNamePattern({
          name: "ab*",
          namespace: "xy*"
        });
        expect(match({ name, namespace })).toEqual(expected);
      }
    );
  });
});
