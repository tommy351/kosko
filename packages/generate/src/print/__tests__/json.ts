import BufferList from "bl";
import { JSONPrinter } from "../json";

test("flush immediately without calling print", () => {
  const writer = new BufferList();
  const printer = new JSONPrinter(writer);

  printer.flush();

  expect(writer.toString()).toEqual("");
});

test("print a single value", () => {
  const writer = new BufferList();
  const printer = new JSONPrinter(writer);
  const data = { foo: "bar" };

  printer.print(data);
  printer.flush();

  expect(JSON.parse(writer.toString())).toEqual(data);
  expect(writer.toString()).toMatchSnapshot();
});

test("print multiple values", () => {
  const writer = new BufferList();
  const printer = new JSONPrinter(writer);
  const data = [{ a: "b" }, { c: "d" }, { e: "f" }];

  for (const item of data) {
    printer.print(item);
  }

  printer.flush();

  expect(JSON.parse(writer.toString())).toEqual({
    apiVersion: "v1",
    kind: "List",
    items: data
  });
  expect(writer.toString()).toMatchSnapshot();
});
