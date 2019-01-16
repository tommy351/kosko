// tslint:disable:no-console
import chalk from "chalk";
import cleanStack from "clean-stack";
import exit from "exit";
import { CLIError, formatError, handleError } from "../error";

jest.spyOn(console, "error").mockImplementation(() => {
  // do nothing
});

jest.mock("exit");

describe("formatError", () => {
  let stack: string;
  let err: Error;

  beforeEach(() => {
    stack = formatError(err);
  });

  describe("when stack is undefined", () => {
    beforeAll(() => {
      err = new Error("foo");
      delete err.stack;
    });

    test("should return message", () => {
      expect(stack).toEqual(err.message);
    });
  });

  describe("when stack is defined", () => {
    beforeAll(() => {
      err = new Error("foo");
    });

    test("should turn stack into gray", () => {
      const [headline, ...rest] = cleanStack(err.stack!, {
        pretty: true
      }).split("\n");

      expect(stack).toEqual(headline + chalk.gray("\n" + rest.join("\n")));
    });
  });

  describe("when message is multi-line", () => {
    beforeAll(() => {
      err = new Error("foo\nbar");
    });

    test("should extract stack properly", () => {
      const [first, second, ...rest] = cleanStack(err.stack!, {
        pretty: true
      }).split("\n");

      expect(stack).toEqual(
        first + "\n" + second + chalk.gray("\n" + rest.join("\n"))
      );
    });
  });
});

describe("handleError", () => {
  let err: any;

  beforeEach(() => {
    handleError(err);
  });

  describe("given a CLIError", () => {
    describe("when output is set", () => {
      beforeAll(() => {
        err = new CLIError("err", { output: "foo" });
      });

      test("should print output", () => {
        expect(console.error).toHaveBeenCalledWith("foo");
      });
    });

    describe("when output is unset", () => {
      beforeAll(() => {
        err = new CLIError("err");
      });

      test("should print stack", () => {
        expect(console.error).toHaveBeenCalledWith(formatError(err));
      });
    });

    describe("when code is set", () => {
      describe("and = 0", () => {
        beforeAll(() => {
          err = new CLIError("err", { code: 0 });
        });

        test("should exit with the code", () => {
          expect(exit).toHaveBeenCalledWith(0);
        });
      });

      describe("and != 0", () => {
        beforeAll(() => {
          err = new CLIError("err", { code: 46 });
        });

        test("should exit with the code", () => {
          expect(exit).toHaveBeenCalledWith(46);
        });
      });
    });

    describe("when code is unset", () => {
      beforeAll(() => {
        err = new CLIError("err");
      });

      test("should exit with 1", () => {
        expect(exit).toHaveBeenCalledWith(1);
      });
    });
  });

  describe("given a normal error", () => {
    beforeAll(() => {
      err = new Error("err");
    });

    test("should exit with 1", () => {
      expect(exit).toHaveBeenCalledWith(1);
    });

    test("should print stack", () => {
      expect(console.error).toHaveBeenCalledWith(formatError(err));
    });
  });

  describe("given non-Error", () => {
    beforeAll(() => {
      err = "foo";
    });

    test("should exit with 1", () => {
      expect(exit).toHaveBeenCalledWith(1);
    });

    test("should print stack", () => {
      expect(console.error).toHaveBeenCalledWith(err);
    });
  });
});
