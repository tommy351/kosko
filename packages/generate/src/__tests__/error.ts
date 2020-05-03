import { ValidationError } from "../error";

let cause: Error;
let err: ValidationError;

function extractStack(stack: string): string {
  const pos = stack.search(/(?:\n {4}at .*)+/);
  return stack.substring(pos);
}

beforeEach(() => {
  err = new ValidationError(__filename, 46, cause);
});

describe("given cause with stack", () => {
  beforeAll(() => {
    cause = new Error("foo");
  });

  test("should add path and index to message", () => {
    expect(err.message).toEqual(
      `${cause.message} (path: ${err.path}, index: ${err.index})`
    );
  });

  test("should add path and index to stack", () => {
    expect(err.stack).toEqual(
      `ValidationError: ${cause.message}\nPath: ${err.path}\nIndex: ${
        err.index
      }${extractStack(cause.stack!)}`
    );
  });
});

describe("given cause without stack", () => {
  beforeAll(() => {
    cause = new Error("foo");
    delete cause.stack;
  });

  test("should add path and index to stack", () => {
    expect(err.stack).toEqual(
      `ValidationError: ${cause.message}\nPath: ${err.path}\nIndex: ${
        err.index
      }${extractStack(err.stack!)}`
    );
  });
});

describe("given cause with stack but without trace", () => {
  beforeAll(() => {
    cause = new Error("foo");
    cause.stack = "bar";
  });

  test("should add path and index to stack", () => {
    expect(err.stack).toStartWith(
      `ValidationError: ${cause.message}\nPath: ${err.path}\nIndex: ${err.index}\n${cause.stack}`
    );
  });
});
