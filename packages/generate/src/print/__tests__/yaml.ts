import BufferList from "bl";
import yaml from "js-yaml";
import { YAMLPrinter } from "../yaml";

test("flush immediately without calling print", () => {
  const writer = new BufferList();
  const printer = new YAMLPrinter(writer);

  printer.flush();

  expect(writer.toString()).toEqual("");
});

test("print a single value", () => {
  const writer = new BufferList();
  const printer = new YAMLPrinter(writer);
  const data = { foo: "bar" };

  printer.print(data);
  printer.flush();

  expect(yaml.load(writer.toString())).toEqual(data);
  expect(writer.toString()).toMatchSnapshot();
});

test("print multiple values", () => {
  const writer = new BufferList();
  const printer = new YAMLPrinter(writer);
  const data = [{ a: "b" }, { c: "d" }, { e: "f" }];

  for (const item of data) {
    printer.print(item);
  }

  printer.flush();

  expect(yaml.loadAll(writer.toString())).toEqual(data);
  expect(writer.toString()).toMatchSnapshot();
});

test("should not convert duplicate objects into references", () => {
  const writer = new BufferList();
  const printer = new YAMLPrinter(writer);
  const ref = { a: "b" };
  const data = {
    foo: ref,
    bar: ref
  };

  printer.print(data);
  printer.flush();

  expect(yaml.load(writer.toString())).toEqual(data);
  expect(writer.toString()).toMatchSnapshot();
});
