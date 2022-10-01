import { Manifest, Result } from "../base";
import JSONPrinter from "./json";
import {
  Printer,
  PrinterConstructor,
  PrintFormat,
  PrintOptions
} from "./types";
import YAMLPrinter from "./yaml";

export { Writer, PrintFormat, PrintOptions } from "./types";

const printers: Record<PrintFormat, PrinterConstructor> = {
  [PrintFormat.JSON]: JSONPrinter,
  [PrintFormat.YAML]: YAMLPrinter
};

function createPrinter(options: PrintOptions): Printer {
  return new printers[options.format]({ writer: options.writer });
}

/**
 * Print result to a stream.
 */
export function print(result: Result, options: PrintOptions): void {
  const data = result.manifests.map((manifest) => manifest.data);
  if (!data.length) return;

  const printer = createPrinter(options);
  printer.printResult(result);
}

/**
 * This function is same as `print`, but takes an `AsyncIterable` instead.
 * It should be used with `generateAsync` function.
 */
export async function printAsync(
  manifests: AsyncIterable<Manifest>,
  options: PrintOptions
): Promise<void> {
  const printer = createPrinter(options);
  await printer.printAsync(manifests);
}
