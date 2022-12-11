import { CLIError, handleError } from "../error";
import logger, { LogLevel } from "@kosko/log";

class YError extends Error {
  constructor() {
    super("Fake yargs error");
  }
}

YError.prototype.name = "YError";

jest.mock("@kosko/log");

const exit = jest.spyOn(process, "exit");

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
        expect(logger.log).toHaveBeenCalledWith(LogLevel.Error, "foo");
      });
    });

    describe("when output is unset", () => {
      beforeAll(() => {
        err = new CLIError("err");
      });

      test("should print stack", () => {
        expect(logger.log).toHaveBeenCalledWith(LogLevel.Error, err.message, {
          error: err
        });
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

  describe("given a YError", () => {
    beforeAll(() => {
      err = new YError();
    });

    test("should exit with 1", () => {
      expect(exit).toHaveBeenCalledWith(1);
    });

    test("should not print log", () => {
      expect(logger.log).not.toHaveBeenCalled();
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
      expect(logger.log).toHaveBeenCalledWith(LogLevel.Error, "", {
        error: err
      });
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
      expect(logger.log).toHaveBeenCalledWith(LogLevel.Error, "", {
        error: "foo"
      });
    });
  });
});
