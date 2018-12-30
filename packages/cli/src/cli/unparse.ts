import { DetailedArguments } from "yargs-parser";

function getFlag(key: string, value: any) {
  const prefix = key.length > 1 ? "--" : "-";
  return prefix + key;
}

function flatten<T>(arr: T[][]): T[] {
  return arr.reduce((acc, x) => acc.concat(x), []);
}

function unparseOption(key: string, value: any, prefix: string = ""): string[] {
  const fullKey = prefix + key;

  if (value === true) return [getFlag(fullKey, value)];
  if (value === false) return [`--no-${fullKey}`];
  if (typeof value !== "object") return [getFlag(fullKey, value), `${value}`];

  let output: string[][];

  if (Array.isArray(value)) {
    output = value.map(v => unparseOption(key, v, prefix));
  } else {
    output = Object.keys(value).map(k =>
      unparseOption(k, value[k], `${prefix}${key}.`)
    );
  }

  return flatten(output);
}

function unparseOptions(args: { [key: string]: any }): string[] {
  const output = Object.keys(args).map(key => unparseOption(key, args[key]));
  return flatten(output);
}

function filterAliases(
  detail: DetailedArguments,
  args: { [key: string]: any }
) {
  const output: { [key: string]: any } = {};
  let filtered: string[] = [];

  for (const key of Object.keys(args)) {
    if (detail.aliases[key]) {
      filtered = filtered.concat(detail.aliases[key]);
    }

    if (!filtered.includes(key)) {
      output[key] = args[key];
    }
  }

  return output;
}

export function unparse(detail: DetailedArguments): string[] {
  const { _: positionals, $0, "--": ends, ...args } = detail.argv;

  return [
    ...positionals,
    ...unparseOptions(filterAliases(detail, args)),
    ...(Array.isArray(ends) ? ["--", ...ends] : [])
  ];
}
