import cleanStack from "clean-stack";
import pc from "picocolors";
import { LogLevel } from "../LogLevel";
import NodeLogWriter from "../NodeLogWriter";
import { Log } from "../types";

jest.spyOn(process.stderr, "write");

const writer = new NodeLogWriter();

function writeInfo(log: Omit<Log, "level" | "loggerLevel" | "time">) {
  writer.write({
    level: LogLevel.Info,
    loggerLevel: LogLevel.Info,
    time: new Date(),
    ...log
  });
}

describe.each([
  [LogLevel.Trace, pc.gray("trace")],
  [LogLevel.Debug, pc.cyan("debug")],
  [LogLevel.Info, pc.green("info ")],
  [LogLevel.Warn, pc.yellow("warn ")],
  [LogLevel.Error, pc.red("error")],
  [LogLevel.Fatal, pc.bgRed("fatal")]
])("when log level = %d", (level, prefix) => {
  test("should print colored level prefix", () => {
    writer.write({
      level,
      loggerLevel: LogLevel.Info,
      time: new Date(),
      message: "test"
    });

    expect(process.stderr.write).toHaveBeenCalledTimes(1);
    expect(process.stderr.write).toHaveBeenCalledWith(`${prefix} - test\n`);
  });

  test("should display time if logger level <= debug", () => {
    const time = new Date("2001-02-03T04:05:06.012Z");
    const h = time.getHours().toString().padStart(2, "0");

    writer.write({
      level,
      loggerLevel: LogLevel.Debug,
      time,
      message: "test"
    });

    expect(process.stderr.write).toHaveBeenCalledTimes(1);
    expect(process.stderr.write).toHaveBeenCalledWith(
      `${pc.gray(`[${h}:05:06.012]`)} ${prefix} - test\n`
    );
  });
});

test("should write data if set", () => {
  writeInfo({ message: "test", data: { foo: "bar" } });
  expect(process.stderr.write).toHaveBeenCalledTimes(1);
  expect(process.stderr.write).toHaveBeenCalledWith(`${pc.green(
    "info "
  )} - test {
  "foo": "bar"
}\n`);
});

test("should write error if set", () => {
  const err = new Error("err message");

  writeInfo({ message: "test", error: err });
  expect(process.stderr.write).toHaveBeenCalledTimes(1);
  expect(process.stderr.write).toHaveBeenCalledWith(`${pc.green("info ")} - test
${pc.gray(cleanStack(err.stack || "", { pretty: true }))}\n`);
});

test("should write both if data & error are set", () => {
  const err = new Error("err message");

  writeInfo({ message: "test", data: { foo: "bar" }, error: err });
  expect(process.stderr.write).toHaveBeenCalledTimes(1);
  expect(process.stderr.write).toHaveBeenCalledWith(`${pc.green(
    "info "
  )} - test {
  "foo": "bar"
}
${pc.gray(cleanStack(err.stack || "", { pretty: true }))}\n`);
});

test("should use error message if message is not set", () => {
  const err = new Error("err message");

  writeInfo({ error: err });
  expect(process.stderr.write).toHaveBeenCalledTimes(1);
  expect(process.stderr.write).toHaveBeenCalledWith(`${pc.green("info ")} - ${
    err.message
  }
${pc.gray(cleanStack(err.stack || "", { pretty: true }))}\n`);
});

test("should not write message if message is undefined", () => {
  writeInfo({});
  expect(process.stderr.write).toHaveBeenCalledTimes(1);
  expect(process.stderr.write).toHaveBeenCalledWith(`${pc.green("info ")} -\n`);
});

test("should use error message for errors without stack", () => {
  writeInfo({ message: "test", error: { message: "err message" } });
  expect(process.stderr.write).toHaveBeenCalledTimes(1);
  expect(process.stderr.write).toHaveBeenCalledWith(`${pc.green("info ")} - test
${pc.gray("err message")}\n`);
});

test("should serialize error for errors without message and stack", () => {
  writeInfo({ message: "test", error: "foo" });
  expect(process.stderr.write).toHaveBeenCalledTimes(1);
  expect(process.stderr.write).toHaveBeenCalledWith(`${pc.green("info ")} - test
${pc.gray("foo")}\n`);
});
