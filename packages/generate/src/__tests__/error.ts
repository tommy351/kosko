/// <reference types="jest-extended"/>
import { ValidationError } from "../error";

let cause: Error;
let err: ValidationError;
let component: unknown;

function extractStack(stack: string): string {
  const pos = stack.search(/(?:\n {4}at .*)+/);
  return stack.substring(pos);
}

beforeEach(() => {
  err = new ValidationError({
    path: __filename,
    index: [4, 6],
    cause,
    component
  });
});

describe("given cause with stack", () => {
  beforeAll(() => {
    cause = new Error("foo");
    component = undefined;
  });

  test("should add path and index to message", () => {
    expect(err.message).toEqual(
      `${cause.message} (path: ${JSON.stringify(
        err.path
      )}, index: [${err.index.join(", ")}])`
    );
  });

  test("should add path and index to stack", () => {
    expect(err.stack).toEqual(
      `ValidationError: ${cause.message}\n- path: ${JSON.stringify(
        err.path
      )}\n- index: [${err.index.join(", ")}]${extractStack(cause.stack!)}`
    );
  });
});

describe("given cause without stack", () => {
  beforeAll(() => {
    cause = new Error("foo");
    delete cause.stack;
    component = undefined;
  });

  test("should add path and index to stack", () => {
    expect(err.stack).toEqual(
      `ValidationError: ${cause.message}\n- path: ${JSON.stringify(
        err.path
      )}\n- index: [${err.index.join(", ")}]${extractStack(err.stack!)}`
    );
  });
});

describe("given cause with stack but without trace", () => {
  beforeAll(() => {
    cause = new Error("foo");
    cause.stack = "bar";
    component = undefined;
  });

  test("should add path and index to stack", () => {
    expect(err.stack).toStartWith(
      `ValidationError: ${cause.message}\n- path: ${JSON.stringify(
        err.path
      )}\n- index: [${err.index.join(", ")}]\n${cause.stack}`
    );
  });
});

describe("given component", () => {
  beforeAll(() => {
    cause = new Error("foo");
    component = {
      apiVersion: "v1",
      kind: "Pod",
      metadata: {
        name: "example"
      }
    };
  });

  test("should add component to message", () => {
    expect(err.message).toEqual(
      `${cause.message} (path: ${JSON.stringify(
        err.path
      )}, index: [${err.index.join(", ")}], kind: "v1/Pod", name: "example")`
    );
  });

  test("should add component to stack", () => {
    expect(err.stack).toEqual(
      `ValidationError: ${cause.message}\n- path: ${JSON.stringify(
        err.path
      )}\n- index: [${err.index.join(
        ", "
      )}]\n- kind: "v1/Pod"\n- name: "example"${extractStack(cause.stack!)}`
    );
  });
});

describe("given component with namespace", () => {
  beforeAll(() => {
    cause = new Error("foo");
    component = {
      apiVersion: "v1",
      kind: "Pod",
      metadata: {
        namespace: "abc",
        name: "def"
      }
    };
  });

  test("should add component to message", () => {
    expect(err.message).toEqual(
      `${cause.message} (path: ${JSON.stringify(
        err.path
      )}, index: [${err.index.join(
        ", "
      )}], kind: "v1/Pod", namespace: "abc", name: "def")`
    );
  });

  test("should add component to stack", () => {
    expect(err.stack).toEqual(
      `ValidationError: ${cause.message}\n- path: ${JSON.stringify(
        err.path
      )}\n- index: [${err.index.join(
        ", "
      )}]\n- kind: "v1/Pod"\n- namespace: "abc"\n- name: "def"${extractStack(
        cause.stack!
      )}`
    );
  });
});

describe("given invalid component without apiVersion", () => {
  beforeAll(() => {
    cause = new Error("foo");
    component = {
      kind: "Pod",
      metadata: {
        namespace: "abc",
        name: "def"
      }
    };
  });

  test("should not add component to message", () => {
    expect(err.message).not.toInclude("apiVersion");
  });

  test("should not add component to stack", () => {
    expect(err.stack).not.toInclude("apiVersion");
  });
});
