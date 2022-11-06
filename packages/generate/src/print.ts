import yaml from "js-yaml";
import stringify from "fast-safe-stringify";
import { Result } from "./base";

/**
 * @public
 */
export interface Writer {
  write(data: string): void;
}

/**
 * @public
 */
export enum PrintFormat {
  YAML = "yaml",
  JSON = "json"
}

/**
 * @public
 */
export interface PrintOptions {
  format: PrintFormat;
  writer: Writer;
}

type Printer<T> = (writer: Writer, data: T) => void;
type PrinterMap<T> = Record<PrintFormat, Printer<T>>;

function stringifyYAML(data: unknown): string {
  return yaml.dump(data, { noRefs: true });
}

function stringifyJSON(data: unknown): string {
  return stringify(data, undefined, "  ");
}

const printers: PrinterMap<unknown> = {
  [PrintFormat.YAML](writer, data) {
    writer.write(stringifyYAML(data));
  },
  [PrintFormat.JSON](writer, data) {
    writer.write(stringifyJSON(data));
  }
};

const arrPrinters: PrinterMap<unknown[]> = {
  [PrintFormat.YAML](writer, data) {
    for (const item of data) {
      writer.write("---\n" + stringifyYAML(item));
    }
  },
  [PrintFormat.JSON](writer, data) {
    const list = { apiVersion: "v1", kind: "List", items: data };
    writer.write(stringifyJSON(list));
  }
};

/**
 * Prints `result` to a {@link Writer}.
 *
 * @public
 */
export function print(result: Result, { format, writer }: PrintOptions): void {
  const data = result.manifests.map((manifest) => manifest.data);
  if (!data.length) return;

  if (data.length > 1) {
    arrPrinters[format](writer, data);
  } else {
    printers[format](writer, data[0]);
  }
}
