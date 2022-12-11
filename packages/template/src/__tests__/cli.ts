import { run } from "../cli";
import { Template } from "../template";
import { writeFiles } from "../write";
import { join } from "node:path";

jest.spyOn(console, "error").mockImplementation(() => {
  // do nothing
});

jest.mock("@kosko/log");
jest.mock("../write.ts");

const exit = jest.spyOn(process, "exit");

describe("when generate resolved", () => {
  const template: Template<{ foo: string; bar: number }> = {
    description: "This is a fake template.",
    options: {
      foo: { type: "string", description: "option foo" },
      bar: { type: "number", description: "option bar" }
    },
    generate: async ({ foo, bar }) => ({
      files: [
        { path: "foo", content: `${foo}` },
        { path: "bar", content: `${bar}` }
      ]
    })
  };
  let argv: string[];

  beforeEach(async () => {
    await run(template, argv);
  });

  describe("when cwd is set", () => {
    const cwd = join(__dirname, "foo");

    beforeAll(() => {
      argv = ["--cwd", cwd, "--foo", "bar", "--bar", "46.93"];
    });

    test("should call writeFiles once", () => {
      expect(writeFiles).toHaveBeenCalledTimes(1);
    });

    test("should write to the specified path", () => {
      expect(writeFiles).toHaveBeenCalledWith(cwd, [
        { path: "foo", content: "bar" },
        { path: "bar", content: "46.93" }
      ]);
    });
  });

  describe("when cwd is not set", () => {
    beforeAll(() => {
      argv = [];
    });

    test("should write to cwd", () => {
      expect(writeFiles).toHaveBeenCalledWith(process.cwd(), expect.any(Array));
    });
  });
});

describe("when generate rejected", () => {
  test("should throw the error", async () => {
    const err = new Error("generate error");
    const template = {
      generate: jest.fn().mockRejectedValue(err)
    };

    await expect(run(template, [])).rejects.toThrow(err);
    expect(exit).toHaveBeenCalledTimes(1);
    expect(exit).toHaveBeenCalledWith(1);
  });
});
