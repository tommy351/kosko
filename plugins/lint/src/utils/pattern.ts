import escapeStringRegexp from "escape-string-regexp";

export type Matcher<T> = (input: T) => boolean;

export function compilePattern(input: string): Matcher<string> {
  const parts = input.split("*");

  // If length is 1, it means there is no * in the input
  if (parts.length === 1) {
    return (value) => value === input;
  }

  // If length is 2, it means there is only one * in the input
  if (parts.length === 2) {
    // If [0] is empty, it means the input starts with *
    const startWithWildcard = !parts[0];

    // If [1] is empty, it means the input ends with *
    const endWithWildcard = !parts[1];

    // Input is *
    if (startWithWildcard && endWithWildcard) {
      return () => true;
    }

    // Input is *pattern
    if (startWithWildcard) {
      return (value) => value.endsWith(parts[1]);
    }

    // Input is pattern*
    if (endWithWildcard) {
      return (value) => value.startsWith(parts[0]);
    }

    // Otherwise, input is some*thing
    return (value) => value.startsWith(parts[0]) && value.endsWith(parts[1]);
  }

  // If length is 3, and both [0] and [2] are empty, it means the input is *pattern*
  if (parts.length === 3 && !parts[0] && !parts[2]) {
    return (value) => value.includes(parts[1]);
  }

  const pattern = parts.map((s) => escapeStringRegexp(s)).join(".*");
  const regex = new RegExp(`^${pattern}$`);

  return (value) => regex.test(value);
}

export function matchAny<T>(matchers: readonly Matcher<T>[]): Matcher<T> {
  return (value) => matchers.some((matcher) => matcher(value));
}

export function matchAll<T>(matchers: readonly Matcher<T>[]): Matcher<T> {
  return (value) => matchers.every((matcher) => matcher(value));
}
