import Logger, { createLoggerFactory } from "../Logger";
import { LogLevel } from "../LogLevel";
import SilentLogWriter from "../SilentLogWriter";

jest.mock("../SilentLogWriter");

beforeEach(() => {
  jest.useFakeTimers();
});

describe("Logger", () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger({
      level: LogLevel.Info,
      writer: new SilentLogWriter()
    });
  });

  describe("getLevel", () => {
    test("should return current level", () => {
      expect(logger.getLevel()).toEqual(LogLevel.Info);
    });
  });

  describe("setLevel", () => {
    test("should update current level", () => {
      logger.setLevel(LogLevel.Warn);
      expect(logger.getLevel()).toEqual(LogLevel.Warn);
    });
  });

  describe.each([
    [LogLevel.Trace, false],
    [LogLevel.Debug, false],
    [LogLevel.Info, true],
    [LogLevel.Warn, true],
    [LogLevel.Error, true],
    [LogLevel.Fatal, true]
  ])("enabled(%d)", (input, expected) => {
    test(`should return ${expected}`, () => {
      expect(logger.enabled(input)).toEqual(expected);
    });
  });

  describe("getWriter", () => {
    test("should return current writer", () => {
      const writer = new SilentLogWriter();
      const logger = new Logger({ level: LogLevel.Info, writer });

      expect(logger.getWriter()).toBe(writer);
    });
  });

  describe("setWriter", () => {
    test("should update current writer", () => {
      const writer = new SilentLogWriter();

      logger.setWriter(writer);
      expect(logger.getWriter()).toBe(writer);
    });
  });

  describe.each([
    [LogLevel.Trace, false],
    [LogLevel.Debug, false],
    [LogLevel.Info, true],
    [LogLevel.Warn, true],
    [LogLevel.Error, true],
    [LogLevel.Fatal, true]
  ])("log(%d)", (input, expected) => {
    test(`should${expected ? " not" : ""} write the log`, () => {
      logger.log(input, "test");

      /* eslint-disable jest/no-conditional-expect */
      if (expected) {
        expect(logger.getWriter().write).toHaveBeenCalledTimes(1);
        expect(logger.getWriter().write).toHaveBeenCalledWith({
          loggerLevel: logger.getLevel(),
          level: input,
          message: "test",
          time: new Date()
        });
      } else {
        expect(logger.getWriter().write).not.toHaveBeenCalled();
      }
      /* eslint-enable jest/no-conditional-expect */
    });
  });

  describe("log", () => {
    test("should use the given time if time is specified", () => {
      const time = new Date(2021, 2, 3);

      logger.log(LogLevel.Info, "test", { time });

      expect(logger.getWriter().write).toHaveBeenCalledWith({
        loggerLevel: logger.getLevel(),
        level: LogLevel.Info,
        message: "test",
        time
      });
    });

    test("should write additional options", () => {
      const time = new Date(2021, 2, 3);
      const err = new Error("test");
      const data = { foo: "bar" };

      logger.log(LogLevel.Info, "test", { time, error: err, data });

      expect(logger.getWriter().write).toHaveBeenCalledWith({
        loggerLevel: logger.getLevel(),
        level: LogLevel.Info,
        message: "test",
        time,
        error: err,
        data
      });
    });
  });
});

describe("createLoggerFactory", () => {
  const factory = createLoggerFactory(() => new SilentLogWriter());

  test("should create a new logger when factory is called", () => {
    const logger = factory();

    expect(logger.getLevel()).toEqual(LogLevel.Info);
  });

  test("should override level when level is set", () => {
    const logger = factory({ level: LogLevel.Debug });

    expect(logger.getLevel()).toEqual(LogLevel.Debug);
  });

  test("should override writer when writer is set", () => {
    const writer = new SilentLogWriter();
    const logger = factory({ writer });

    expect(logger.getWriter()).toBe(writer);
  });

  test("should not call createWriter if writer is set", () => {
    const createWriter = jest.fn();
    const factory = createLoggerFactory(createWriter);

    factory({ writer: new SilentLogWriter() });

    expect(createWriter).not.toHaveBeenCalled();
  });
});
