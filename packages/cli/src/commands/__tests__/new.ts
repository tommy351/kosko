import BufferList from "bl";
import { help } from "../../cli/help";
import { Logger } from "../../cli/logger";
import { Context } from "../../cli/types";
import { newCmd } from "../new";

jest.mock("../../cli/help");
jest.mock(
  "fake-template",
  () => ({
    description: "This is a fake template.",
    options: {
      foo: { type: "string", description: "option foo" },
      bar: { type: "number", description: "option bar", required: true }
    },
    generate: jest.fn()
  }),
  { virtual: true }
);

const bl = new BufferList();
const ctx: Context = { logger: new Logger(bl) };

beforeEach(() => jest.resetAllMocks());

describe("when template is not set", () => {
  test("should print help", async () => {
    await newCmd.exec(ctx, []);
    expect(help).toHaveBeenCalledTimes(1);
    expect(help).toHaveBeenCalledWith(newCmd);
  });
});

describe("when template is set", () => {
  //
});
