// tslint:disable:no-console
import cleanStack from "clean-stack";
import exit from "exit";
import { CLIError, handleError } from "../error";

jest.spyOn(console, "error").mockImplementation(() => {
  // do nothing
});

jest.mock("exit");

describe("handleError", () => {
  let err: Error;

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
        expect(console.error).toHaveBeenCalledWith(cleanStack(err.stack!));
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
    describe("when stack is set", () => {
      beforeAll(() => {
        err = new Error("err");
      });

      test("should exit with 1", () => {
        expect(exit).toHaveBeenCalledWith(1);
      });

      test("should print stack", () => {
        expect(console.error).toHaveBeenCalledWith(cleanStack(err.stack!));
      });
    });

    describe("when stack is undefined", () => {
      beforeAll(() => {
        err = new Error("err");
        delete err.stack;
      });

      test("should exit with 1", () => {
        expect(exit).toHaveBeenCalledWith(1);
      });

      test("should print stack", () => {
        expect(console.error).toHaveBeenCalledWith("foo");
      });
    });
  });
});
