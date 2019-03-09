import yaml from "js-yaml";
import { Writable } from "stream";
import { Result } from "./base";

export enum PrintFormat {
  YAML = "yaml",
  JSON = "json"
}

export interface PrintOptions {
  format: PrintFormat;
  writer: Writable;
}

type Printer<T> = (writer: Writable, data: T) => void;
type PrinterMap<T> = { [key in PrintFormat]: Printer<T> };

function stringifyYAML(data: any): string {
  return yaml.safeDump(data, { noRefs: true });
}

function stringifyJSON(data: any): string {
  return JSON.stringify(data, null, "  ");
}

const printers: PrinterMap<any> = {
  [PrintFormat.YAML](writer, data) {
    writer.write(stringifyYAML(data));
  },
  [PrintFormat.JSON](writer, data) {
    writer.write(stringifyJSON(data));
  }
};

const arrPrinters: PrinterMap<any[]> = {
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
 * Print result to a stream.
 *
 * @param result
 * @param options
 */
export function print(result: Result, { format, writer }: PrintOptions): void {
  const data = result.manifests.map(manifest => manifest.data);
  if (!data.length) return;

  if (data.length > 1) {
    arrPrinters[format](writer, data);
  } else {
    printers[format](writer, data[0]);
  }
}
