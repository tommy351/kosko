import BufferList from "bl";
import { help } from "../../cli/help";
import { Logger } from "../../cli/logger";
import { Context } from "../../cli/types";
import { generateCmd } from "../generate";
import { ParseError } from "../../cli/parse";
import { generate, print, PrintFormat } from "@kosko/generate";

jest.mock("../../cli/help");
jest.mock("@kosko/generate");

const bl = new BufferList();
const ctx: Context = { logger: new Logger(bl) };

beforeEach(() => jest.resetAllMocks());

describe("when options.help is true", () => {
  test("should show help", async () => {
    await generateCmd.exec(ctx, ["--help"]);
    expect(help).toHaveBeenCalledWith(generateCmd);
    expect(help).toHaveBeenCalledTimes(1);
  });
});

describe("when options.env is not set", () => {
  test("should throw ParseError", async () => {
    await expect(generateCmd.exec(ctx, [])).rejects.toThrowError(ParseError);
  });
});

describe("when options.require is set", () => {
  //
});

describe("when options.env is set", () => {
  test("should set global.kosko.env", async () => {
    await generateCmd.exec(ctx, ["--env", "foo"]);
    expect(global.kosko.env).toEqual("foo");
  });
});

describe("when components is not set", () => {
  test("should use default pattern", async () => {
    await generateCmd.exec(ctx, ["--env", "foo"]);
    expect(generate).toHaveBeenCalledTimes(1);
    expect(generate).toHaveBeenCalledWith({
      path: process.cwd(),
      components: ["*"]
    });
  });
});

describe("when components is set", () => {
  test("should use default pattern", async () => {
    await generateCmd.exec(ctx, ["--env", "foo", "bar/*", "*.js"]);
    expect(generate).toHaveBeenCalledTimes(1);
    expect(generate).toHaveBeenCalledWith({
      path: process.cwd(),
      components: ["bar/*", "*.js"]
    });
  });
});

describe("when options.output is not set", () => {
  test("should output YAML", async () => {
    await generateCmd.exec(ctx, ["--env", "foo"]);
    expect(print).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenCalledWith(undefined, {
      format: PrintFormat.YAML,
      writer: process.stdout
    });
  });
});

describe("when options.output is set", () => {
  test("should output YAML", async () => {
    await generateCmd.exec(ctx, ["--env", "foo", "--output", "json"]);
    expect(print).toHaveBeenCalledTimes(1);
    expect(print).toHaveBeenCalledWith(undefined, {
      format: PrintFormat.JSON,
      writer: process.stdout
    });
  });
});
