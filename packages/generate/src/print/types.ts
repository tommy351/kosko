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

/**
 * @public
 */
export interface Printer {
  print(data: unknown): void;
  flush(): void;
}
