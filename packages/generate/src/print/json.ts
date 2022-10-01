import { Result, Manifest } from "../base";
import { Printer } from "./types";

const INDENT = "  ";
const NEWLINE = "\n";

function stringifyJSON(data: unknown): string {
  return JSON.stringify(data, null, INDENT);
}

function prefixEveryLine(input: string, prefix: string): string {
  return input
    .split(NEWLINE)
    .map((x) => (x ? `${prefix}${x}` : x))
    .join(NEWLINE);
}

export default class JSONPrinter extends Printer {
  public printResult(result: Result): void {
    if (result.manifests.length === 1) {
      this.writer.write(stringifyJSON(result.manifests[0].data));
      return;
    }

    this.printListHead();

    for (let i = 0; i < result.manifests.length; i++) {
      if (i) this.printListSep();
      this.printListItem(result.manifests[i].data);
    }

    this.printListTail();
  }

  public async printAsync(manifests: AsyncIterable<Manifest>): Promise<void> {
    let first: Manifest | undefined;
    let count = 0;

    for await (const manifest of manifests) {
      if (!count) {
        first = manifest;
      } else if (count === 1) {
        this.printListHead();

        if (first) {
          this.printListItem(first.data);
          this.printListSep();
        }

        this.printListItem(manifest.data);
      } else {
        this.printListSep();
        this.printListItem(manifest.data);
      }

      count++;
    }

    if (count > 1) {
      this.printListTail();
    } else if (first) {
      this.writer.write(stringifyJSON(first.data));
    }
  }

  private printListHead() {
    this.writer.write(`{
${INDENT}"apiVersion": "v1",
${INDENT}"kind": "List",
${INDENT}"items": [
`);
  }

  private printListSep() {
    this.writer.write(",\n");
  }

  private printListItem(data: unknown) {
    this.writer.write(prefixEveryLine(stringifyJSON(data), INDENT + INDENT));
  }

  private printListTail() {
    this.writer.write(`
${INDENT}]
}`);
  }
}
