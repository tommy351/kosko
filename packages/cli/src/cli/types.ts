import { Logger } from "./logger";

export interface WithAlias {
  alias?: string | string[];
}

export interface BaseOption<T = any> {
  description?: string;
  default?: T | (() => T | undefined);
  required?: boolean;
  options?: T[];
}

export function getAliases({ alias }: WithAlias): string[] {
  if (Array.isArray(alias)) return alias;
  return alias ? [alias] : [];
}

export interface Arg<K = string, V = any> extends BaseOption<V> {
  name: K;
}

export enum OptionType {
  String = "string",
  Boolean = "boolean",
  Count = "count",
  Number = "number",
  Array = "array"
}

export interface Option<T = any> extends WithAlias, BaseOption<T> {
  type?: OptionType;
  group?: string;
}

export interface CommandMeta<Options = any> {
  usage?: string;
  description?: string;
  examples?: string;
  options?: { [key in keyof Options]: Option };
  commands?: { [key: string]: Command };
  args?: Arg[];
}

export interface Command<Options = any> extends CommandMeta<Options> {
  exec(ctx: Context, argv: string[]): void;
}

export interface Context {
  logger: Logger;
}
