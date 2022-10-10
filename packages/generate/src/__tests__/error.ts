/// <reference types="jest-extended"/>
import extractStack from "extract-stack";
import { ResolveError } from "../error";

describe("when only message is given", () => {
  const err = new ResolveError("test");

  test("should set name", () => {
    expect(err.name).toEqual("ResolveError");
  });

  test("should set message", () => {
    expect(err.message).toEqual("test");
  });

  test("should keep stack as is", () => {
    expect(err.stack).toEqual(`ResolveError: test
${extractStack(err.stack)}`);
  });
});

describe("when path is given but it is empty", () => {
  const err = new ResolveError("test", { path: "" });

  test("should not append path to stack", () => {
    expect(err.stack).not.toEqual(expect.stringContaining("Path:"));
  });
});

describe("when path is given and it is not empty", () => {
  const err = new ResolveError("test", { path: "test path" });

  test("should append path to stack", () => {
    expect(err.stack).toEqual(`ResolveError: test
    Path: test path
${extractStack(err.stack)}`);
  });
});

describe("when index is given but it is empty", () => {
  const err = new ResolveError("test", { index: [] });

  test("should not append index to stack", () => {
    expect(err.stack).not.toEqual(expect.stringContaining("Index: []"));
  });
});

describe("when index is given and it is not empty", () => {
  const err = new ResolveError("test", { index: [1, 3, 6] });

  test("should append index to stack", () => {
    expect(err.stack).toEqual(`ResolveError: test
    Index: [1, 3, 6]
${extractStack(err.stack)}`);
  });
});

describe("when value is given but it is not a component", () => {
  const err = new ResolveError("test", { value: "value test" });

  test("should not append value to stack", () => {
    expect(err.stack).not.toEqual(expect.stringContaining("value test"));
  });
});

describe("when value is given but apiVersion is not defined", () => {
  const err = new ResolveError("test", {
    value: {
      kind: "Test",
      metadata: { name: "test" }
    }
  });

  test("should not append value to stack", () => {
    expect(err.stack).not.toEqual(expect.stringContaining("Name: test"));
  });
});

describe("when value is given but kind is not defined", () => {
  const err = new ResolveError("test", {
    value: {
      apiVersion: "kosko.dev/v1",
      metadata: { name: "test" }
    }
  });

  test("should not append value to stack", () => {
    expect(err.stack).not.toEqual(expect.stringContaining("Name: test"));
  });
});

describe("when value is given but metadata.name is not defined", () => {
  const err = new ResolveError("test", {
    value: {
      apiVersion: "kosko.dev/v1",
      kind: "Test"
    }
  });

  test("should not append value to stack", () => {
    expect(err.stack).not.toEqual(
      expect.stringContaining("Kind: kosko.dev/v1/Test")
    );
  });
});

describe("when value is given and it is like a component", () => {
  const err = new ResolveError("test", {
    value: {
      apiVersion: "kosko.dev/v1",
      kind: "Test",
      metadata: {
        name: "resolve-error-test"
      }
    }
  });

  test("should append component info to stack", () => {
    expect(err.stack).toEqual(`ResolveError: test
    Kind: kosko.dev/v1/Test
    Name: resolve-error-test
${extractStack(err.stack)}`);
  });
});

describe("when value is given and it contains metadata.namespace", () => {
  const err = new ResolveError("test", {
    value: {
      apiVersion: "kosko.dev/v1",
      kind: "Test",
      metadata: {
        name: "resolve-error-test",
        namespace: "namespace-test"
      }
    }
  });

  test("should append component info to stack", () => {
    expect(err.stack).toEqual(`ResolveError: test
    Kind: kosko.dev/v1/Test
    Namespace: namespace-test
    Name: resolve-error-test
${extractStack(err.stack)}`);
  });
});

describe("when cause is an Error instance", () => {
  const cause = new Error("test message");
  cause.name = "TestError";

  const err = new ResolveError("test", { cause });

  test("should append cause to stack", () => {
    expect(err.stack).toEqual(`ResolveError: test
    Cause: TestError: test message
${extractStack(cause.stack)
  .split("\n")
  .map((line) => `    ${line}`)
  .join("\n")}
${extractStack(err.stack)}`);
  });
});

describe("when cause is an object with name and message", () => {
  const cause = { name: "TestError", message: "test err" };

  const err = new ResolveError("test", { cause });

  test("should append cause to stack", () => {
    expect(err.stack).toEqual(`ResolveError: test
    Cause: TestError: test err
${extractStack(err.stack)}`);
  });
});

describe("when cause is an object with message only", () => {
  const cause = { message: "test err" };

  const err = new ResolveError("test", { cause });

  test("should append cause to stack", () => {
    expect(err.stack).toEqual(`ResolveError: test
    Cause: Error: test err
${extractStack(err.stack)}`);
  });
});

describe("when cause is an empty object", () => {
  const cause = {};

  const err = new ResolveError("test", { cause });

  test("should not append cause to stack", () => {
    expect(err.stack).toEqual(`ResolveError: test
${extractStack(err.stack)}`);
  });
});

describe("when cause is null", () => {
  const err = new ResolveError("test", { cause: null });

  test("should not append cause to stack", () => {
    expect(err.stack).toEqual(`ResolveError: test
${extractStack(err.stack)}`);
  });
});
