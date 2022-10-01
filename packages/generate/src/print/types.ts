import { Manifest, Result } from "../base";

export interface Writer {
  write(data: string): void;
}

export enum PrintFormat {
  YAML = "yaml",
  JSON = "json"
}

export interface PrintOptions {
  format: PrintFormat;
  writer: Writer;
}

export interface PrinterOptions {
  writer: Writer;
}

export type PrinterConstructor = new (options: PrinterOptions) => Printer;

export abstract class Printer {
  protected readonly writer: Writer;

  constructor(options: PrinterOptions) {
    this.writer = options.writer;
  }

  public abstract printResult(result: Result): void;

  public abstract printAsync(manifests: AsyncIterable<Manifest>): Promise<void>;
}
