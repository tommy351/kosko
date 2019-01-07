/// <reference types="jest-extended"/>
import { Signale } from "signale";
import { Argv } from "yargs";
import { getLogger, parse, setLogger, wrapHandler } from "../command";

jest.mock("signale");

// tslint:disable-next-line:no-var-requires
const yargs = require("yargs/yargs");

describe("getLogger", () => {
  describe("when logger is set", () => {
    test("should return the logger", () => {
      const logger = {};
      const ctx = setLogger({} as any, logger as any);
      expect(getLogger(ctx)).toBe(logger);
    });
  });

  describe("when logger is unset", () => {
    test("should throw an error", () => {
      expect(() => {
        getLogger({} as any);
      }).toThrow("Logger is not set in the context");
    });
  });
});

describe("setLogger", () => {
  test("should set the logger", () => {
    const logger = {};
    const ctx = setLogger({ foo: "bar" } as any, logger as any);
    expect(getLogger(ctx)).toBe(logger);
    expect(ctx).toHaveProperty("foo", "bar");
  });
});

describe("parse", () => {
  describe("when parse failed", () => {
    describe("and err is defined", () => {
      test("should throw an error", async () => {
        await expect(parse(yargs().demandCommand(), [])).rejects.toThrow(
          "Not enough non-option arguments: got 0, need at least 1"
        );
      });
    });

    describe("and err is undefined", () => {
      test("should throw an error", async () => {
        await expect(
          parse(yargs().demandCommand(), ["--help"])
        ).rejects.toThrow("CLI error");
      });
    });
  });

  describe("when parse succeed", () => {
    describe("with subcommand", () => {
      let input: Argv;
      let handler: jest.Mock;

      beforeEach(() => {
        handler = jest.fn();
        input = yargs().command({
          command: "foo",
          handler: wrapHandler(handler)
        });
      });

      describe("when subcommand resolved", () => {
        let logger: Signale;

        beforeEach(async () => {
          handler.mockImplementationOnce(async ctx => {
            logger = getLogger(ctx);
          });

          await parse(input, ["foo", "--bar", "baz"]);
        });

        test("should call handler once", () => {
          expect(handler).toHaveBeenCalledTimes(1);
        });

        test("should call handler with args", () => {
          expect(handler).toHaveBeenCalledWith(
            expect.objectContaining({
              bar: "baz",
              _: ["foo"]
            })
          );
        });

        test("should set logger", () => {
          expect(logger).toBeInstanceOf(Signale);
        });

        test("should set stream of logger to stderr", () => {
          expect(Signale).toHaveBeenCalledWith({ stream: process.stderr });
        });
      });

      describe("when subcommand rejected", () => {
        const err = new Error("command error");

        beforeEach(() => {
          handler.mockRejectedValueOnce(err);
        });

        test("should reject", async () => {
          await expect(parse(input, ["foo"])).rejects.toThrow(err);
        });
      });

      describe("given --silent option", () => {
        beforeEach(async () => {
          handler.mockResolvedValueOnce({});
          await parse(input, ["foo", "--silent"]);
        });

        test("should disable logger", () => {
          expect(Signale).toHaveBeenCalledWith({
            stream: process.stderr,
            disabled: true
          });
        });
      });
    });

    describe("without subcommand", () => {
      test("should resolve", async () => {
        await parse(yargs(), []);
      });
    });
  });
});
