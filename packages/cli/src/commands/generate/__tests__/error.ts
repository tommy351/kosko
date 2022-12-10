import { handleGenerateError } from "../error";
import BufferList from "bl";
import AggregateError from "@kosko/aggregate-error";
import { GenerateError, ResolveError } from "@kosko/generate";
import { join, normalize } from "node:path";
import { CLIError } from "../../../cli/error";

let stderr: BufferList;

jest.spyOn(process.stderr, "write");

// Returns a new Error without Jest in stack.
function newError(message: string) {
  const err = new Error(message);
  cleanErrorStack(err);
  return err;
}

function cleanErrorStack(err: Error) {
  if (err.stack) {
    err.stack = err.stack
      .split("\n")
      .filter((x) => !x.includes("jest") && !x.includes(__filename))
      .join("\n");
  }
}

beforeEach(() => {
  stderr = new BufferList();
  (process.stderr.write as jest.Mock).mockImplementation((chunk) => {
    stderr.write(chunk);
  });
});

describe("when error is a AggregateError", () => {
  const cwd = normalize("/foo/bar");

  test("should group errors by their path", () => {
    const result = handleGenerateError(
      cwd,
      new AggregateError([
        // ResolveError
        new ResolveError("first resolve err", { path: join(cwd, "a/b.js") }),
        new ResolveError("second resolve err", { path: join(cwd, "c/d.js") }),
        // GenerateError
        new GenerateError("first generate err", { path: join(cwd, "a/b.js") }),
        new ResolveError("second generate err", { path: join(cwd, "c/d.js") }),
        // Other errors
        newError("first other err"),
        newError("second other err")
      ]),
      {}
    );

    expect(result).toBeInstanceOf(CLIError);
    expect(result.message).toEqual("Generate failed");
    expect(result.output).toEqual(`Generate failed (Total 6 errors)`);
    expect(stderr.toString()).toMatchSnapshot();
  });
});

describe("when error is a nested AggregatedError", () => {
  test("should flatten errors", () => {
    const result = handleGenerateError(
      "",
      new AggregateError([
        newError("root err"),
        new AggregateError([
          newError("child err"),
          new AggregateError([newError("grandchild err")])
        ])
      ]),
      {}
    );
    expect(result.output).toEqual(`Generate failed (Total 3 errors)`);
    expect(stderr.toString()).toMatchSnapshot();
  });
});

describe("when error is a ResolveError without path", () => {
  test("should treat as a normal error", () => {
    const err = new ResolveError("test err");
    cleanErrorStack(err);
    handleGenerateError("", err, {});
    expect(stderr.toString()).toMatchSnapshot();
  });
});

describe("when error is a ResolveError with path", () => {
  test("should treat as a normal error", () => {
    const cwd = normalize("/foo");
    handleGenerateError(
      cwd,
      new ResolveError("test err", { path: join(cwd, "a.js") }),
      {}
    );
    expect(stderr.toString()).toMatchSnapshot();
  });
});

describe("when error is a ResolveError with path not in cwd", () => {
  test("should print the full path", () => {
    const cwd = normalize("/foo");
    handleGenerateError(
      cwd,
      new ResolveError("test err", { path: join("/bar", "a.js") }),
      {}
    );
    expect(stderr.toString()).toMatchSnapshot();
  });
});

describe("when error is a ResolveError with index", () => {
  test("should print index", () => {
    const cwd = normalize("/");
    handleGenerateError(
      cwd,
      new ResolveError("test err", {
        path: join(cwd, "a.js"),
        index: [1, 3, 5]
      }),
      {}
    );
    expect(stderr.toString()).toMatchSnapshot();
  });
});

describe("when error is a ResolveError with cause", () => {
  test("should print index", () => {
    const cwd = normalize("/");
    handleGenerateError(
      cwd,
      new ResolveError("test err", {
        path: join(cwd, "a.js"),
        cause: newError("test err cause")
      }),
      {}
    );
    expect(stderr.toString()).toMatchSnapshot();
  });
});

describe("when error is a ResolveError with component", () => {
  test("should print index", () => {
    const cwd = normalize("/");
    handleGenerateError(
      cwd,
      new ResolveError("test err", {
        path: join(cwd, "a.js"),
        value: {
          apiVersion: "kosko.dev/v1",
          kind: "Test",
          metadata: {
            name: "bar"
          }
        }
      }),
      {}
    );
    expect(stderr.toString()).toMatchSnapshot();
  });
});

describe("when error is a ResolveError with component.namespace", () => {
  test("should print index", () => {
    const cwd = normalize("/");
    handleGenerateError(
      cwd,
      new ResolveError("test err", {
        path: join(cwd, "a.js"),
        value: {
          apiVersion: "kosko.dev/v1",
          kind: "Test",
          metadata: {
            namespace: "foo",
            name: "bar"
          }
        }
      }),
      {}
    );
    expect(stderr.toString()).toMatchSnapshot();
  });
});

describe("when error is a ResolveError with ValidationError cause", () => {
  test("should print validation error", () => {
    const cwd = normalize("/");
    const cause = Object.assign(new Error(), {
      ajv: true,
      validation: true,
      errors: [
        { instancePath: "/a/b", message: "is required" },
        { instancePath: "/c/d", message: "must be an integer" },
        {
          instancePath: "/e/f",
          keyword: "enum",
          message: "must be one of enums",
          params: { allowedValues: ["foo", "bar"] }
        }
      ]
    });
    handleGenerateError(
      cwd,
      new ResolveError("validation err", {
        path: join(cwd, "a/b.js"),
        cause
      }),
      {}
    );
    expect(stderr.toString()).toMatchSnapshot();
  });
});

describe("when error is a GenerateError without path", () => {
  test("should treat as a normal error", () => {
    const err = new GenerateError("test err");
    cleanErrorStack(err);
    handleGenerateError("", err, {});
    expect(stderr.toString()).toMatchSnapshot();
  });
});

describe("when error is a GenerateError with path", () => {
  test("should treat as a normal error", () => {
    const cwd = normalize("/foo");
    handleGenerateError(
      cwd,
      new GenerateError("test err", { path: join(cwd, "a.js") }),
      {}
    );
    expect(stderr.toString()).toMatchSnapshot();
  });
});

describe("when error is a GenerateError with path not in cwd", () => {
  test("should print the full path", () => {
    const cwd = normalize("/foo");
    handleGenerateError(
      cwd,
      new GenerateError("test err", { path: join("/bar", "a.js") }),
      {}
    );
    expect(stderr.toString()).toMatchSnapshot();
  });
});

describe("when error is a GenerateError with cause", () => {
  test("should print index", () => {
    const cwd = normalize("/foo");
    handleGenerateError(
      cwd,
      new GenerateError("test err", {
        path: join(cwd, "a.js"),
        cause: newError("test err cause")
      }),
      {}
    );
    expect(stderr.toString()).toMatchSnapshot();
  });
});

describe("when error is an Error", () => {
  test("should print in other error section", () => {
    handleGenerateError("", newError("test err"), {});
    expect(stderr.toString()).toMatchSnapshot();
  });
});

describe("when error is a string", () => {
  test("should print as an error", () => {
    handleGenerateError("", "test err", {});
    expect(stderr.toString()).toMatchSnapshot();
  });
});

describe("when error is an object with name and message", () => {
  test("should print as an error", () => {
    handleGenerateError("", { name: "TestError", message: "test err" }, {});
    expect(stderr.toString()).toMatchSnapshot();
  });
});

describe("when error is an object with message only", () => {
  test("should print as an error", () => {
    handleGenerateError("", { message: "test err" }, {});
    expect(stderr.toString()).toMatchSnapshot();
  });
});

describe("when error is an empty object", () => {
  test("should ignore the error", () => {
    handleGenerateError("", {}, {});
    expect(stderr.toString()).toEqual("");
  });
});

describe("when error is null", () => {
  test("should ignore the error", () => {
    handleGenerateError("", null, {});
    expect(stderr.toString()).toEqual("");
  });
});

describe("when bail = true", () => {
  test("should print bail hint", () => {
    const result = handleGenerateError("", new Error("test"), { bail: true });

    expect(result.output).toEqual(
      "Generate failed (Only the first error is displayed because `bail` option is enabled)"
    );
  });
});
