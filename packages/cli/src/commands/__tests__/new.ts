import { writeFiles } from "@kosko/template";
import BufferList from "bl";
import { baseOptions } from "../../base";
import { help } from "../../cli/help";
import { Logger } from "../../cli/logger";
import { ParseError } from "../../cli/parse";
import { Context } from "../../cli/types";
import resolve from "../../utils/resolve";
import { newCmd } from "../new";

const resolveMock = resolve as jest.Mock;

jest.mock("../../cli/help");
jest.mock("../../utils/resolve");
jest.mock("@kosko/template");

jest.mock(
  "fake-template",
  () => ({
    description: "This is a fake template.",
    options: {
      foo: { type: "string", description: "option foo" },
      bar: { type: "number", description: "option bar", required: true }
    },
    generate: async ({ foo, bar }: any) => ({
      files: [
        { path: "foo", content: `${foo}` },
        { path: "bar", content: `${bar}` }
      ]
    })
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
  describe("and module does not exist", () => {
    const resolveErr = new Error("resolve error");

    beforeEach(() => {
      resolveMock.mockRejectedValueOnce(resolveErr);
    });

    test("should throw an error", async () => {
      await expect(newCmd.exec(ctx, ["unknown"])).rejects.toThrow(resolveErr);
    });
  });

  describe("and module exists", () => {
    beforeEach(() => {
      resolveMock.mockResolvedValueOnce("fake-template");
    });

    describe("and options.help is true", () => {
      beforeEach(async () => {
        await newCmd.exec(ctx, ["fake-template", "--help"]);
      });

      test("should run help once", () => {
        expect(help).toHaveBeenCalledTimes(1);
      });

      test("should run help with template options", async () => {
        expect(help).toHaveBeenCalledWith(
          expect.objectContaining({
            usage: "kosko new fake-template",
            description: "This is a fake template.",
            options: {
              ...baseOptions,
              foo: { type: "string", description: "option foo" },
              bar: { type: "number", description: "option bar", required: true }
            }
          })
        );
      });
    });

    describe("and options parse failed", () => {
      test("should throw ParseError", async () => {
        await expect(newCmd.exec(ctx, ["fake-template"])).rejects.toThrow(
          ParseError
        );
      });
    });

    describe("and parse succeed", () => {
      beforeEach(async () => {
        await newCmd.exec(ctx, [
          "fake-template",
          "--foo",
          "bar",
          "--bar",
          "46.93"
        ]);
      });

      test("should call writeFiles once", () => {
        expect(writeFiles).toHaveBeenCalledTimes(1);
      });

      test("should call writeFiles with files", () => {
        expect(writeFiles).toHaveBeenCalledWith(process.cwd(), [
          { path: "foo", content: "bar" },
          { path: "bar", content: "46.93" }
        ]);
      });
    });
  });
});
