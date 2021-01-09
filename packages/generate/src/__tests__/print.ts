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

describe("when no manifests", () => {
  beforeAll(() => {
    result = { manifests: [] };
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

  describe("and only one manifest", () => {
    const data = { foo: "bar" };

    beforeAll(() => {
      result = {
        manifests: [{ path: "", index: [0], data }]
      };
    });

    test("should write YAML", () => {
      expect(yaml.load(bl.toString())).toEqual(data);
    });
  });

  describe("and multiple manifests", () => {
    const data = [{ foo: "bar" }, { bar: "boo" }, { boo: "baz" }];

    beforeAll(() => {
      result = {
        manifests: data.map((x) => ({ path: "", index: [0], data: x }))
      };
    });

    test("should write YAML with delimiters", () => {
      expect(yaml.loadAll(bl.toString())).toEqual(data);
    });
  });
});

describe("when format = JSON", () => {
  beforeAll(() => {
    options = { format: PrintFormat.JSON };
  });

  describe("and only one manifest", () => {
    const data = { foo: "bar" };

    beforeAll(() => {
      result = { manifests: [{ path: "", index: [0], data }] };
    });

    test("should write JSON", () => {
      expect(JSON.parse(bl.toString())).toEqual(data);
    });
  });

  describe("and multiple manifests", () => {
    const data = [{ foo: "bar" }, { bar: "boo" }, { boo: "baz" }];

    beforeAll(() => {
      result = {
        manifests: data.map((x) => ({ path: "", index: [0], data: x }))
      };
    });

    test("should write JSON wrapped with List", () => {
      expect(JSON.parse(bl.toString())).toEqual({
        apiVersion: "v1",
        kind: "List",
        items: data
      });
    });
  });
});
