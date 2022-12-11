import { createRootCommand } from "../root";
import { resolve } from "node:path";

describe("rootCmd", () => {
  describe("cwd coerce", () => {
    let argv: string[];
    let args: any;

    beforeEach(() => {
      args = createRootCommand(argv).demandCommand(0).parse();
    });

    describe("when cwd is specified", () => {
      beforeAll(() => {
        argv = ["--cwd", "./bar"];
      });

      test("should resolve path", () => {
        expect(args).toHaveProperty("cwd", resolve("./bar"));
      });
    });

    describe("when cwd is absolute", () => {
      beforeAll(() => {
        argv = ["--cwd", __dirname];
      });

      test("should return the absolute path directly", () => {
        expect(args).toHaveProperty("cwd", __dirname);
      });
    });

    describe("when cwd is not specified", () => {
      beforeAll(() => {
        argv = [];
      });

      test("should return process.cwd", () => {
        expect(args).toHaveProperty("cwd", process.cwd());
      });
    });
  });
});
