import stringify from "fast-safe-stringify";
import { Printer, Writer } from "./types";

const EOL = "\n";
const INDENT = "  ";

export class JSONPrinter implements Printer {
  private written = false;
  private buffer: unknown;

  public constructor(private writer: Writer) {}

  public print(value: unknown) {
    if (this.written) {
      this.writeValue(value);
    } else if (this.buffer != null) {
      this.written = true;

      this.writeListStart();
      this.writeValue(this.buffer);

      this.buffer = null;

      this.writeValue(value);
    } else {
      this.buffer = value;
    }
  }

  public flush() {
    if (this.buffer != null) {
      this.writeValue(this.buffer);
    }

    if (this.written) {
      this.writeListEnd();
    }
  }

  private writeValue(value: unknown) {
    let result = stringify(value, undefined, INDENT);

    if (this.written) {
      if (this.buffer == null) {
        this.writer.write(",\n");
      }

      result = result
        .split(EOL)
        .map((line) => `${INDENT}${INDENT}${line}`)
        .join(EOL);
    }

    this.writer.write(result);
  }

  private writeListStart() {
    this.writer.write(`{
  "apiVersion": "v1",
  "kind": "List",
  "items": [
`);
  }

  private writeListEnd() {
    this.writer.write(`
  ]
}`);
  }
}
