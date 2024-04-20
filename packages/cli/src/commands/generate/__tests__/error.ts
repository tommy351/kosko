/// <reference types="jest-extended" />
import { CLIError } from "@kosko/cli-utils";
import { handleGenerateError, printIssues } from "../error";
import BufferList from "bl";
import { createManifest } from "../test-utils";

let stderr: BufferList;

jest.spyOn(process.stderr, "write");

function createError(msg: string): Error {
  const err = new Error(msg);
  // Set a fake stack because Jest injects a lot of stack frames
  err.stack = `Error: ${msg}\n    at foo.ts:1:1`;
  return err;
}

beforeEach(() => {
  stderr = new BufferList();
  (process.stderr.write as jest.Mock).mockImplementation((chunk) => {
    stderr.write(chunk);
  });
});

describe("printIssues", () => {
  test("single error issue", () => {
    expect(() => {
      printIssues("", {
        manifests: [
          createManifest({
            position: { path: "components/foo.ts", index: [] },
            issues: [{ severity: "error", message: "Error message" }]
          })
        ]
      });
    }).toThrowWithMessage(CLIError, "Generate failed");

    expect(stderr.toString()).toMatchSnapshot();
  });

  test("single warning issue", () => {
    printIssues("", {
      manifests: [
        createManifest({
          position: { path: "components/foo.ts", index: [] },
          issues: [{ severity: "warning", message: "Warning message" }]
        })
      ]
    });

    expect(stderr.toString()).toMatchSnapshot();
  });

  test("manifest contains metadata", () => {
    expect(() => {
      printIssues("", {
        manifests: [
          createManifest({
            position: { path: "components/foo.ts", index: [] },
            issues: [{ severity: "error", message: "Error message" }],
            metadata: {
              apiVersion: "v1",
              kind: "Pod",
              name: "foo"
            }
          })
        ]
      });
    }).toThrowWithMessage(CLIError, "Generate failed");

    expect(stderr.toString()).toMatchSnapshot();
  });

  test("metadata contains namespace", () => {
    expect(() => {
      printIssues("", {
        manifests: [
          createManifest({
            position: { path: "components/foo.ts", index: [] },
            issues: [{ severity: "error", message: "Error message" }],
            metadata: {
              apiVersion: "v1",
              kind: "Pod",
              namespace: "default",
              name: "foo"
            }
          })
        ]
      });
    }).toThrowWithMessage(CLIError, "Generate failed");

    expect(stderr.toString()).toMatchSnapshot();
  });

  test("index is not empty", () => {
    expect(() => {
      printIssues("", {
        manifests: [
          createManifest({
            position: { path: "components/foo.ts", index: [2, 4] },
            issues: [{ severity: "error", message: "Error message" }]
          })
        ]
      });
    }).toThrowWithMessage(CLIError, "Generate failed");

    expect(stderr.toString()).toMatchSnapshot();
  });

  test("metadata and index are present", () => {
    expect(() => {
      printIssues("", {
        manifests: [
          createManifest({
            position: { path: "components/foo.ts", index: [2, 4] },
            issues: [{ severity: "error", message: "Error message" }],
            metadata: {
              apiVersion: "v1",
              kind: "Pod",
              name: "foo"
            }
          })
        ]
      });
    }).toThrowWithMessage(CLIError, "Generate failed");

    expect(stderr.toString()).toMatchSnapshot();
  });

  test("ignore manifests without issues", () => {
    expect(() => {
      printIssues("", {
        manifests: [
          createManifest(),
          createManifest({
            position: { path: "components/bar.ts", index: [] },
            issues: [{ severity: "error", message: "Error message" }]
          })
        ]
      });
    }).toThrowWithMessage(CLIError, "Generate failed");

    expect(stderr.toString()).toMatchSnapshot();
  });

  test("issue contains a string cause", () => {
    expect(() => {
      printIssues("", {
        manifests: [
          createManifest({
            position: { path: "components/foo.ts", index: [] },
            issues: [
              {
                severity: "error",
                message: "Error message",
                cause: "Cause message"
              }
            ]
          })
        ]
      });
    }).toThrowWithMessage(CLIError, "Generate failed");

    expect(stderr.toString()).toMatchSnapshot();
  });

  test("issue contains an object cause", () => {
    expect(() => {
      printIssues("", {
        manifests: [
          createManifest({
            position: { path: "components/foo.ts", index: [] },
            issues: [
              {
                severity: "error",
                message: "Error message",
                cause: {
                  name: "FooError",
                  message: "foobar"
                }
              }
            ]
          })
        ]
      });
    }).toThrowWithMessage(CLIError, "Generate failed");

    expect(stderr.toString()).toMatchSnapshot();
  });

  test("issue contains a Error class cause", () => {
    expect(() => {
      printIssues;
      printIssues("", {
        manifests: [
          createManifest({
            position: { path: "components/foo.ts", index: [] },
            issues: [
              {
                severity: "error",
                message: "Error message",
                cause: createError("foobar")
              }
            ]
          })
        ]
      });
    }).toThrowWithMessage(CLIError, "Generate failed");

    expect(stderr.toString()).toMatchSnapshot();
  });

  test("cause is a empty object", () => {
    expect(() => {
      printIssues("", {
        manifests: [
          createManifest({
            position: { path: "components/foo.ts", index: [] },
            issues: [
              {
                severity: "error",
                message: "Error message",
                cause: {}
              }
            ]
          })
        ]
      });
    }).toThrowWithMessage(CLIError, "Generate failed");

    expect(stderr.toString()).toMatchSnapshot();
  });

  test("multiple issues", () => {
    expect(() => {
      printIssues("", {
        manifests: [
          createManifest({
            position: { path: "components/foo.ts", index: [] },
            issues: [
              { severity: "error", message: "Error 1" },
              { severity: "warning", message: "Warning 1" },
              { severity: "error", message: "Error 2" }
            ]
          }),
          createManifest({
            position: { path: "components/bar.ts", index: [] },
            issues: [{ severity: "error", message: "Error 3" }]
          })
        ]
      });
    }).toThrowWithMessage(CLIError, "Generate failed");

    expect(stderr.toString()).toMatchSnapshot();
  });

  test("cwd is not empty", () => {
    expect(() => {
      printIssues("/foo/bar", {
        manifests: [
          createManifest({
            position: { path: "/foo/bar/components/foo.ts", index: [] },
            issues: [{ severity: "error", message: "Error message" }]
          }),
          createManifest({
            position: { path: "/abc/def/components/bar.ts", index: [] },
            issues: [{ severity: "error", message: "Error message" }]
          })
        ]
      });
    }).toThrowWithMessage(CLIError, "Generate failed");

    expect(stderr.toString()).toMatchSnapshot();
  });
});

describe("handleGenerateError", () => {
  test("normal error", () => {
    expect(() => {
      handleGenerateError(createError("foo"));
    }).toThrowWithMessage(CLIError, "Generate failed");

    expect(stderr.toString()).toMatchSnapshot();
  });

  test("AggregateError", () => {
    expect(() => {
      handleGenerateError(
        new AggregateError([createError("foo"), createError("bar")])
      );
    }).toThrowWithMessage(CLIError, "Generate failed");

    expect(stderr.toString()).toMatchSnapshot();
  });

  test("nested AggregateError", () => {
    expect(() => {
      handleGenerateError(
        new AggregateError([
          createError("foo"),
          new AggregateError([createError("bar"), createError("baz")])
        ])
      );
    }).toThrowWithMessage(CLIError, "Generate failed");

    expect(stderr.toString()).toMatchSnapshot();
  });

  test("value is undefined", () => {
    expect(() => {
      handleGenerateError(undefined);
    }).toThrowWithMessage(CLIError, "Generate failed");

    expect(stderr.toString()).toBeEmpty();
  });
});
