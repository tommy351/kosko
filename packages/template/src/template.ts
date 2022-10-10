import yargs from "yargs";

export interface Template<T> {
  description?: string;
  options?: { [P in keyof T]: Options<T[P], T> };
  generate(options: T): Promise<Result>;
}

type OptionKeyRefs<T> = T | readonly T[] | Record<string, T | readonly T[]>;

type Options<T, O> = yargs.Options & {
  coerce?: (arg: any) => T;
  choices?: readonly T[];
  default?: T | (() => T | undefined);
  conflicts?: OptionKeyRefs<keyof O>;
  implies?: OptionKeyRefs<keyof O>;
} & (T extends string
    ? { type: "string" } | { string: true }
    : T extends number
    ? { type: "number" | "count" } | { number: true } | { count: true }
    : T extends boolean
    ? { type: "boolean" } | { boolean: true }
    : T extends any[]
    ? { type: "array" } | { array: true }
    : unknown);

export interface Result {
  files: readonly File[];
}

export interface File {
  /**
   * Destination path of a file.
   */
  path: string;

  /**
   * File content.
   */
  content: string;
}
