import { Options } from "yargs";

export interface Template<T> {
  description?: string;
  options?: { [P in keyof T]: InferredOptions };
  generate(options: T): Promise<Result>;
}

type DefaultValue<T> = T | (() => T | undefined);

type TypelessOptions = Pick<
  Options,
  Exclude<
    keyof Options,
    "type" | "array" | "boolean" | "count" | "number" | "string"
  >
>;

interface TypedOptions<T> extends TypelessOptions {
  coerce?: (arg: any) => T;
  default?: DefaultValue<T>;
}

type InferredOptions =
  | { type: "string" } & TypedOptions<string>
  | { string: true } & TypedOptions<string>
  | { type: "number" } & TypedOptions<number>
  | { number: true } & TypedOptions<number>
  | { type: "array" } & TypedOptions<string[]>
  | { array: true } & TypedOptions<string[]>
  | { type: "count" } & TypedOptions<number>
  | { count: true } & TypedOptions<number>
  | { type: "boolean" } & TypedOptions<boolean>
  | { boolean: true } & TypedOptions<boolean>;

export interface Result {
  files: ReadonlyArray<File>;
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
