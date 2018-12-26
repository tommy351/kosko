import BufferList from "bl";
import yaml from "js-yaml";
import { Result } from "../base";
import { print, PrintFormat, PrintOptions } from "../print";

let result: Result;
let options: Pick<PrintOptions, Exclude<keyof PrintOptions, "writer">>;
let bl: BufferList;

beforeEach(() => {
  bl = new BufferList();
  print(result, {
    ...options,
    writer: bl
  });
});

describe("when no resources", () => {
  beforeAll(() => {
    result = { resources: [] };
    options = { format: PrintFormat.YAML };
  });

  test("should write nothing", () => {
    expect(bl.toString()).toEqual("");
  });
});

describe("when format = YAML", () => {
  beforeAll(() => {
    options = { format: PrintFormat.YAML };
  });

  describe("and only one resource", () => {
    const data = { foo: "bar" };

    beforeAll(() => {
      result = {
        resources: [{ path: "", data }]
      };
    });

    it("should write YAML", () => {
      expect(yaml.safeLoad(bl.toString())).toEqual(data);
    });
  });

  describe("and multiple resources", () => {
    const data = [{ foo: "bar" }, { bar: "boo" }, { boo: "baz" }];

    beforeAll(() => {
      result = {
        resources: data.map(x => ({ path: "", data: x }))
      };
    });

    it("should write YAML with delimiters", () => {
      expect(yaml.safeLoadAll(bl.toString())).toEqual(data);
    });
  });
});

describe("when format = JSON", () => {
  beforeAll(() => {
    options = { format: PrintFormat.JSON };
  });

  describe("and only one resource", () => {
    const data = { foo: "bar" };

    beforeAll(() => {
      result = { resources: [{ path: "", data }] };
    });

    it("should write JSON", () => {
      expect(JSON.parse(bl.toString())).toEqual(data);
    });
  });

  describe("and multiple resources", () => {
    const data = [{ foo: "bar" }, { bar: "boo" }, { boo: "baz" }];

    beforeAll(() => {
      result = { resources: data.map(x => ({ path: "", data: x })) };
    });

    it("should write JSON wrapped with List", () => {
      expect(JSON.parse(bl.toString())).toEqual({
        apiVersion: "v1",
        kind: "List",
        items: data
      });
    });
  });
});
