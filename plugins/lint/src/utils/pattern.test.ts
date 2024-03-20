import { compilePattern, matchAll, matchAny } from "./pattern";

describe("compilePattern", () => {
  test.each([
    // No * in the pattern
    { pattern: "foo", input: "foo", expected: true },
    { pattern: "foo", input: "bar", expected: false },
    // * at the start
    { pattern: "*foo", input: "foo", expected: true },
    { pattern: "*foo", input: "barfoo", expected: true },
    { pattern: "*foo", input: "bar", expected: false },
    // * at the end
    { pattern: "foo*", input: "foo", expected: true },
    { pattern: "foo*", input: "foobar", expected: true },
    { pattern: "foo*", input: "bar", expected: false },
    // * at the center
    { pattern: "foo*bar", input: "foobar", expected: true },
    { pattern: "foo*bar", input: "foo123bar", expected: true },
    { pattern: "foo*bar", input: "bar", expected: false },
    // * at the start and end
    { pattern: "*foo*", input: "foo", expected: true },
    { pattern: "*foo*", input: "barfoo", expected: true },
    { pattern: "*foo*", input: "foobar", expected: true },
    { pattern: "*foo*", input: "afoob", expected: true },
    { pattern: "*foo*", input: "bar", expected: false },
    // Multiple * at the center
    { pattern: "a*b*c", input: "abc", expected: true },
    { pattern: "a*b*c", input: "a1bc", expected: true },
    { pattern: "a*b*c", input: "ab2c", expected: true },
    { pattern: "a*b*c", input: "a1b2c", expected: true },
    { pattern: "a*b*c", input: "bc", expected: false },
    { pattern: "a*b*c", input: "ab", expected: false },
    // Only *
    { pattern: "*", input: "a", expected: true },
    { pattern: "*", input: "", expected: true },
    // Pattern contains characters that need to be escaped
    { pattern: "a.b*c*d", input: "a.b1c2d", expected: true },
    { pattern: "a.b*c*d", input: "a1b1c2d", expected: false }
  ])(
    `should return $expected when pattern = "$pattern", input = "$input"`,
    ({ pattern, input, expected }) => {
      const match = compilePattern(pattern);
      expect(match(input)).toEqual(expected);
    }
  );
});

describe("matchAny", () => {
  const match = matchAny([(s) => s === "a", (s) => s === "b"]);

  test("should return true when one of the matchers returns true", () => {
    expect(match("a")).toBe(true);
  });

  test("should return false when none of the matchers returns true", () => {
    expect(match("c")).toBe(false);
  });
});

describe("matchAll", () => {
  const match = matchAll([
    (s: string) => s.includes("a"),
    (s: string) => s.includes("b")
  ]);

  test("should return true when all of the matchers returns true", () => {
    expect(match("ab")).toBe(true);
  });

  test("should return false when one of the matchers returns false", () => {
    expect(match("a")).toBe(false);
  });

  test("should return false when none of the matchers returns true", () => {
    expect(match("c")).toBe(false);
  });
});
