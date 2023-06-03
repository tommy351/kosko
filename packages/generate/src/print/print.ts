import { PrintFormat, PrintOptions, Printer, Writer } from "./types";
import { Result } from "../base";
import { YAMLPrinter } from "./yaml";
import { JSONPrinter } from "./json";

type PrinterConstructor = new (writer: Writer) => Printer;

const printerMap: Record<PrintFormat, PrinterConstructor> = {
  [PrintFormat.YAML]: YAMLPrinter,
  [PrintFormat.JSON]: JSONPrinter
};

/**
 * @public
 */
export function getPrinter(options: PrintOptions): Printer {
  const Printer = printerMap[options.format];
  if (!Printer) throw new Error(`Unknown print format: ${options.format}`);

  return new Printer(options.writer);
}

/**
 * Prints `result` to a {@link Writer}.
 *
 * @public
 */
export function print(result: Result, options: PrintOptions): void {
  const printer = getPrinter(options);
  const data = result.manifests.map((manifest) => manifest.data);
  if (!data.length) return;

  for (const item of data) {
    printer.print(item);
  }

  printer.flush();
}
