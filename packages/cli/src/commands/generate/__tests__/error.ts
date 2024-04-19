/// <reference types="jest-extended" />
import { CLIError } from "@kosko/cli-utils";
import { printIssues } from "../error";
import BufferList from "bl";

let stderr: BufferList;

jest.spyOn(process.stderr, "write");

beforeEach(() => {
  stderr = new BufferList();
  (process.stderr.write as jest.Mock).mockImplementation((chunk) => {
    stderr.write(chunk);
  });
});

test("single error issue", () => {
  expect(() => {
    printIssues("", {
      manifests: [
        {
          position: { path: "components/foo.ts", index: [] },
          data: {},
          issues: [
            {
              severity: "error",
              message: "Error message"
            }
          ],
          report() {}
        }
      ]
    });
  }).toThrowWithMessage(CLIError, "Generate failed");

  expect(stderr.toString()).toMatchSnapshot();
});

test("single warning issue", () => {
  printIssues("", {
    manifests: [
      {
        position: { path: "components/foo.ts", index: [] },
        data: {},
        issues: [
          {
            severity: "warning",
            message: "Warning message"
          }
        ],
        report() {}
      }
    ]
  });

  expect(stderr.toString()).toMatchSnapshot();
});

test("manifest contains metadata", () => {
  expect(() => {
    printIssues("", {
      manifests: [
        {
          position: { path: "components/foo.ts", index: [] },
          data: {},
          issues: [
            {
              severity: "error",
              message: "Error message"
            }
          ],
          metadata: {
            apiVersion: "v1",
            kind: "Pod",
            name: "foo"
          },
          report() {}
        }
      ]
    });
  }).toThrowWithMessage(CLIError, "Generate failed");

  expect(stderr.toString()).toMatchSnapshot();
});

test("metadata contains namespace", () => {
  expect(() => {
    printIssues("", {
      manifests: [
        {
          position: { path: "components/foo.ts", index: [] },
          data: {},
          issues: [
            {
              severity: "error",
              message: "Error message"
            }
          ],
          metadata: {
            apiVersion: "v1",
            kind: "Pod",
            namespace: "default",
            name: "foo"
          },
          report() {}
        }
      ]
    });
  }).toThrowWithMessage(CLIError, "Generate failed");

  expect(stderr.toString()).toMatchSnapshot();
});

test("index is not empty", () => {
  expect(() => {
    printIssues("", {
      manifests: [
        {
          position: { path: "components/foo.ts", index: [2, 4] },
          data: {},
          issues: [
            {
              severity: "error",
              message: "Error message"
            }
          ],
          report() {}
        }
      ]
    });
  }).toThrowWithMessage(CLIError, "Generate failed");

  expect(stderr.toString()).toMatchSnapshot();
});

test("metadata and index are present", () => {
  expect(() => {
    printIssues("", {
      manifests: [
        {
          position: { path: "components/foo.ts", index: [2, 4] },
          data: {},
          issues: [
            {
              severity: "error",
              message: "Error message"
            }
          ],
          metadata: {
            apiVersion: "v1",
            kind: "Pod",
            name: "foo"
          },
          report() {}
        }
      ]
    });
  }).toThrowWithMessage(CLIError, "Generate failed");

  expect(stderr.toString()).toMatchSnapshot();
});

test("ignore manifests without issues", () => {
  expect(() => {
    printIssues("", {
      manifests: [
        {
          position: { path: "components/foo.ts", index: [] },
          data: {},
          issues: [],
          report() {}
        },
        {
          position: { path: "components/bar.ts", index: [] },
          data: {},
          issues: [
            {
              severity: "error",
              message: "Error message"
            }
          ],
          report() {}
        }
      ]
    });
  }).toThrowWithMessage(CLIError, "Generate failed");

  expect(stderr.toString()).toMatchSnapshot();
});

test("issue contains a string cause", () => {
  expect(() => {
    printIssues("", {
      manifests: [
        {
          position: { path: "components/foo.ts", index: [] },
          data: {},
          issues: [
            {
              severity: "error",
              message: "Error message",
              cause: "Cause message"
            }
          ],
          report() {}
        }
      ]
    });
  }).toThrowWithMessage(CLIError, "Generate failed");

  expect(stderr.toString()).toMatchSnapshot();
});

test("issue contains an object cause", () => {
  expect(() => {
    printIssues("", {
      manifests: [
        {
          position: { path: "components/foo.ts", index: [] },
          data: {},
          issues: [
            {
              severity: "error",
              message: "Error message",
              cause: {
                name: "FooError",
                message: "foobar"
              }
            }
          ],
          report() {}
        }
      ]
    });
  }).toThrowWithMessage(CLIError, "Generate failed");

  expect(stderr.toString()).toMatchSnapshot();
});

test("issue contains a Error class cause", () => {
  expect(() => {
    const err = new Error("foobar");
    err.stack = "Error: foobar\n  at foo.ts:1:1";

    printIssues;
    printIssues("", {
      manifests: [
        {
          position: { path: "components/foo.ts", index: [] },
          data: {},
          issues: [
            {
              severity: "error",
              message: "Error message",
              cause: err
            }
          ],
          report() {}
        }
      ]
    });
  }).toThrowWithMessage(CLIError, "Generate failed");

  expect(stderr.toString()).toMatchSnapshot();
});

test("cause is a empty object", () => {
  expect(() => {
    printIssues("", {
      manifests: [
        {
          position: { path: "components/foo.ts", index: [] },
          data: {},
          issues: [
            {
              severity: "error",
              message: "Error message",
              cause: {}
            }
          ],
          report() {}
        }
      ]
    });
  }).toThrowWithMessage(CLIError, "Generate failed");

  expect(stderr.toString()).toMatchSnapshot();
});

test("multiple issues", () => {
  expect(() => {
    printIssues("", {
      manifests: [
        {
          position: { path: "components/foo.ts", index: [] },
          data: {},
          issues: [
            {
              severity: "error",
              message: "Error 1"
            },
            {
              severity: "warning",
              message: "Warning 1"
            },
            {
              severity: "error",
              message: "Error 2"
            }
          ],
          report() {}
        },
        {
          position: { path: "components/bar.ts", index: [] },
          data: {},
          issues: [
            {
              severity: "error",
              message: "Error 3"
            }
          ],
          report() {}
        }
      ]
    });
  }).toThrowWithMessage(CLIError, "Generate failed");

  expect(stderr.toString()).toMatchSnapshot();
});

test("cwd is not empty", () => {
  expect(() => {
    printIssues("/foo/bar", {
      manifests: [
        {
          position: { path: "/foo/bar/components/foo.ts", index: [] },
          data: {},
          issues: [
            {
              severity: "error",
              message: "Error message"
            }
          ],
          report() {}
        },
        {
          position: { path: "/abc/def/components/bar.ts", index: [] },
          data: {},
          issues: [
            {
              severity: "error",
              message: "Error message"
            }
          ],
          report() {}
        }
      ]
    });
  }).toThrowWithMessage(CLIError, "Generate failed");

  expect(stderr.toString()).toMatchSnapshot();
});
