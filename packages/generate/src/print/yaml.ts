import { Printer, Writer } from "./types";
import yaml from "js-yaml";

export class YAMLPrinter implements Printer {
  private written = false;
  private buffer: unknown;

  public constructor(private writer: Writer) {}

  public print(value: unknown) {
    if (this.written) {
      this.writeMarker();
      this.writeValue(value);
    } else if (this.buffer != null) {
      this.writeMarker();
      this.writeValue(this.buffer);
      this.writeMarker();
      this.writeValue(value);

      this.written = true;
      this.buffer = null;
    } else {
      this.buffer = value;
    }
  }

  public flush() {
    if (this.buffer != null) {
      this.writeValue(this.buffer);
    }
  }

  private writeMarker() {
    this.writer.write("---\n");
  }

  private writeValue(value: unknown) {
    this.writer.write(yaml.dump(value, { noRefs: true }));
  }
}
