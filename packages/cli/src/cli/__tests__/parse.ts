import { ParseError, ParseResult, parse } from "../parse";
import { Command, OptionType } from "../types";

describe("ParseError", () => {
  test("should format parse errors", () => {
    const err = new ParseError([
      { arg: "foo", message: "bar" },
      { option: "bar", message: "baz" }
    ]);

    expect(err.message).toEqual(`Argument "foo": bar
Option "--bar": baz`);
  });
});

describe("parse", () => {
  let argv: string[];
  let cmd: Pick<Command, "options" | "args">;
  let result: ParseResult<any, any>;

  beforeEach(() => {
    result = parse(argv, cmd);
  });

  describe("options", () => {
    describe("success", () => {
      beforeAll(() => {
        argv = [
          "--str",
          "foo",
          "--num",
          "46",
          "--count",
          "--count",
          "--arr",
          "foo",
          "--arr",
          "bar",
          "--bool"
        ];
        cmd = {
          options: {
            str: { type: OptionType.String },
            num: { type: OptionType.Number },
            count: { type: OptionType.Count },
            arr: { type: OptionType.Array },
            bool: { type: OptionType.Boolean }
          }
        };
      });

      test("should return options", () => {
        expect(result.options).toEqual({
          str: "foo",
          num: 46,
          count: 2,
          arr: ["foo", "bar"],
          bool: true
        });
      });

      test("should have no errors", () => {
        expect(result.errors).toEqual([]);
      });
    });

    describe("default", () => {
      beforeAll(() => {
        argv = [];
        cmd = {
          options: {
            foo: { default: "bar" }
          }
        };
      });

      test("should set default value", () => {
        expect(result.options.foo).toEqual("bar");
      });
    });

    describe("required", () => {
      beforeAll(() => {
        argv = [];
        cmd = {
          options: {
            foo: { required: true }
          }
        };
      });

      test("should return the error", () => {
        expect(result.errors).toEqual([{ option: "foo", message: "Required" }]);
      });
    });

    describe("options", () => {
      beforeAll(() => {
        argv = ["--foo", "c"];
        cmd = {
          options: {
            foo: { options: ["a", "b"] }
          }
        };
      });

      test("should return the error", () => {
        expect(result.errors).toEqual([
          { option: "foo", message: "Must be one of [a, b]" }
        ]);
      });
    });
  });

  describe("args", () => {
    describe("success", () => {
      beforeAll(() => {
        argv = ["foo", "bar"];
        cmd = {
          args: [{ name: "first" }, { name: "second" }]
        };
      });

      test("should return options", () => {
        expect(result.args).toEqual({
          first: "foo",
          second: "bar"
        });
      });

      test("should have no errors", () => {
        expect(result.errors).toEqual([]);
      });
    });

    describe("default", () => {
      beforeAll(() => {
        argv = [];
        cmd = {
          args: [{ name: "foo", default: "bar" }]
        };
      });

      test("should set default value", () => {
        expect(result.args.foo).toEqual("bar");
      });
    });

    describe("required", () => {
      beforeAll(() => {
        argv = [];
        cmd = {
          args: [{ name: "foo", required: true }]
        };
      });

      test("should return the error", () => {
        expect(result.errors).toEqual([{ arg: "foo", message: "Required" }]);
      });
    });

    describe("options", () => {
      beforeAll(() => {
        argv = ["--foo", "c"];
        cmd = {
          args: [{ name: "foo", options: ["a", "b"] }]
        };
      });

      test("should return the error", () => {
        expect(result.errors).toEqual([
          { arg: "foo", message: "Must be one of [a, b]" }
        ]);
      });
    });
  });
});
