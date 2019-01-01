import { help } from "../help";
import { CommandMeta, OptionType } from "../types";
import BufferList from "bl";

let cmd: CommandMeta;
let bl: BufferList;

beforeEach(async () => {
  bl = new BufferList();
  await help(cmd, bl);
});

describe("usage", () => {
  beforeAll(() => {
    cmd = { usage: "foo bar" };
  });

  test("should print the usage", () => {
    expect(bl.toString()).toContain(`Usage: ${cmd.usage}`);
  });
});

describe("description", () => {
  beforeAll(() => {
    cmd = { description: "do something" };
  });

  test("should print the description", () => {
    expect(bl.toString()).toContain(cmd.description);
  });
});

describe("args", () => {
  beforeAll(() => {
    cmd = {
      args: [
        { name: "foo", description: "desc of foo" },
        { name: "bazz", description: "desc of bazz" }
      ]
    };
  });

  test("should print the arguments", () => {
    expect(bl.toString()).toMatchSnapshot();
  });
});

describe("commands", () => {
  beforeAll(() => {
    cmd = {
      commands: {
        foo: { description: "desc of foo" },
        bazz: { description: "desc of bazz" }
      } as any
    };
  });

  test("should print the commands", () => {
    expect(bl.toString()).toMatchSnapshot();
  });
});

describe("options", () => {
  beforeAll(() => {
    cmd = {
      options: {
        str: { type: OptionType.String, description: "desc of str" },
        bool: { type: OptionType.Boolean, description: "desc of bool" },
        count: { type: OptionType.Count, description: "desc of count" },
        arr: { type: OptionType.Array, description: "desc of arr" },
        num: { type: OptionType.Number, description: "desc of num" },
        unknown: { description: "some unknown option" },
        onealias: { alias: "o", description: "one alias" },
        morealias: { alias: ["m", "more"], description: "more aliases" },
        camelCase: { description: "camel case" }
      }
    };
  });

  test("should print the options", () => {
    expect(bl.toString()).toMatchSnapshot();
  });
});

describe("options with groups", () => {
  beforeAll(() => {
    cmd = {
      options: {
        help: { description: "show help", group: "Global Options" },
        foo: { description: "foo" },
        version: { description: "show version", group: "Global Options" },
        bar: { description: "bar", group: "Hidden Options" }
      }
    };
  });

  test("should print the options", () => {
    expect(bl.toString()).toMatchSnapshot();
  });
});

describe("put all together", () => {
  beforeAll(() => {
    cmd = {
      usage: "foo",
      description: "desc foo desc",
      commands: {
        bar: { description: "subcommand bar" } as any
      },
      options: {
        foo: { description: "option foo" }
      },
      args: [{ name: "baz", description: "arg bar" }]
    };
  });

  test("should print the options", () => {
    expect(bl.toString()).toMatchSnapshot();
  });
});
