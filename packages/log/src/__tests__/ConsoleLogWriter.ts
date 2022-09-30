import ConsoleLogWriter from "../ConsoleLogWriter";
import { LogLevel } from "../LogLevel";
import { Log } from "../types";

jest.spyOn(console, "trace");
jest.spyOn(console, "debug");
jest.spyOn(console, "info");
jest.spyOn(console, "warn");
jest.spyOn(console, "error");

const writer = new ConsoleLogWriter();

function writeInfo(log: Omit<Log, "level" | "loggerLevel" | "time">) {
  writer.write({
    level: LogLevel.Info,
    loggerLevel: LogLevel.Info,
    time: new Date(),
    ...log
  });
}

describe.each([
  [LogLevel.Trace, console.trace],
  [LogLevel.Debug, console.debug],
  [LogLevel.Info, console.info],
  [LogLevel.Warn, console.warn],
  [LogLevel.Error, console.error],
  [LogLevel.Fatal, console.error]
])("when log level = %d", (level, log) => {
  test("should write to console", () => {
    writer.write({
      level,
      loggerLevel: LogLevel.Info,
      time: new Date(),
      message: "test"
    });
    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith("test");
  });
});

test("should not write message if empty", () => {
  writeInfo({ message: "" });
  expect(console.info).toHaveBeenCalledTimes(1);
  expect(console.info).toHaveBeenCalledWith();
});

test("should write data if set", () => {
  writeInfo({ message: "test", data: { foo: "bar" } });
  expect(console.info).toHaveBeenCalledTimes(1);
  expect(console.info).toHaveBeenCalledWith("test", { foo: "bar" });
});

test("should write error if set", () => {
  const err = new Error("err test");
  writeInfo({ message: "test", error: err });
  expect(console.info).toHaveBeenCalledTimes(1);
  expect(console.info).toHaveBeenCalledWith("test", err);
});

test("should write both if data & error are set", () => {
  const err = new Error("err test");
  writeInfo({ message: "test", data: { foo: "bar" }, error: err });
  expect(console.info).toHaveBeenCalledTimes(1);
  expect(console.info).toHaveBeenCalledWith("test", { foo: "bar" }, err);
});
