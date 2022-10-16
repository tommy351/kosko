import { LogLevel, logLevelFromString } from "../LogLevel";

describe.each([
  ["trace", LogLevel.Trace],
  ["debug", LogLevel.Debug],
  ["info", LogLevel.Info],
  ["warn", LogLevel.Warn],
  ["error", LogLevel.Error],
  ["fatal", LogLevel.Fatal],
  ["foo", undefined]
])("logLevelFromString(%s)", (input, expected) => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  test(`should return ${expected}`, () => {
    expect(logLevelFromString(input)).toEqual(expected);
  });
});
