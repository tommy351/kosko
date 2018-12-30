import { rootCmd } from "../root";
import BufferList from "bl";
import { help } from "../cli/help";
import { Logger } from "../cli/logger";
import { Context } from "../cli/types";

jest.mock("../cli/help");
jest.mock("../commands", () => ({
  foo: { exec: jest.fn() }
}));

const bl = new BufferList();
const ctx: Context = { logger: new Logger(bl) };

let argv: string[];

beforeEach(async () => {
  jest.resetAllMocks();
  await rootCmd.exec(ctx, argv);
});

describe("when command is set", () => {
  describe("when command exists", () => {
    beforeAll(() => {
      argv = ["foo", "-a", "b"];
    });

    test("should execute the command", () => {
      const cmd = require("../commands").foo;
      expect(cmd.exec).toHaveBeenCalledTimes(1);
      expect(cmd.exec).toHaveBeenCalledWith(ctx, argv.slice(1));
    });

    test("should not print help", () => {
      expect(help).not.toHaveBeenCalled();
    });
  });

  describe("when command does not exist", () => {
    beforeAll(() => {
      argv = ["bar"];
    });

    test("should print help", () => {
      expect(help).toHaveBeenCalledTimes(1);
      expect(help).toHaveBeenCalledWith(rootCmd);
    });
  });
});

describe("when command is not set", () => {
  beforeAll(() => {
    argv = [];
  });

  test("should print help", () => {
    expect(help).toHaveBeenCalledTimes(1);
    expect(help).toHaveBeenCalledWith(rootCmd);
  });
});
