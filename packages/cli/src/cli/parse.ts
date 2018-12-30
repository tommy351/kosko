import mapValues from "lodash.mapvalues";
import parser, { DetailedArguments } from "yargs-parser";
import {
  Arg,
  BaseOption,
  Command,
  getAliases,
  Option,
  OptionType
} from "./types";

export class ParseError extends Error {
  constructor(details: ParseErrorDetail[]) {
    const msg = details
      .map(({ arg, option, message }) => {
        if (arg) return `Argument "${arg}": ${message}`;
        return `Option "--${option}": ${message}`;
      })
      .join("\n");

    super(msg);
  }
}

export interface ParseErrorDetail {
  arg?: string;
  option?: string;
  message: string;
}

export interface ParseResult<Options, Args> {
  options: Options;
  args: Args;
  detail: DetailedArguments;
  errors: ParseErrorDetail[];
}

interface OptionMap {
  [key: string]: Option;
}

function filterByType(options: OptionMap, type: OptionType): string[] {
  return Object.keys(options).filter(key => options[key].type === type);
}

function getParserOptions(options: { [key: string]: Option }): parser.Options {
  return {
    alias: mapValues(options, getAliases),
    array: filterByType(options, OptionType.Array),
    boolean: filterByType(options, OptionType.Boolean),
    count: filterByType(options, OptionType.Count),
    number: filterByType(options, OptionType.Number),
    string: filterByType(options, OptionType.String)
  };
}

interface ValidateBaseOptionsResult {
  value?: any;
  error?: string;
}

function validateBaseOption(
  option: BaseOption,
  value: any
): ValidateBaseOptionsResult {
  if (value == null) {
    if (typeof option.default === "function") {
      return { value: option.default() };
    }

    if (option.default != null) {
      return { value: option.default };
    }

    if (option.required) {
      return { error: "Required" };
    }
  }

  if (Array.isArray(option.options)) {
    if (!option.options.includes(value)) {
      return { error: `Must be one of [${option.options.join(", ")}]` };
    }
  }

  return { value };
}

interface ValidateOptionsResult {
  options: any;
  errors: ParseErrorDetail[];
}

function validateOptions(
  detail: DetailedArguments,
  options: OptionMap
): ValidateOptionsResult {
  const result: ValidateOptionsResult = {
    options: {},
    errors: []
  };

  Object.keys(options).forEach(key => {
    const { value, error } = validateBaseOption(options[key], detail.argv[key]);

    if (error) {
      result.errors.push({ option: key, message: error });
    } else {
      result.options[key] = value;
    }
  });

  return result;
}

interface ValidateArgsResult {
  args: any;
  errors: ParseErrorDetail[];
}

function validateArgs(
  detail: DetailedArguments,
  args: Arg[]
): ValidateArgsResult {
  const result: ValidateArgsResult = {
    args: {},
    errors: []
  };

  args.forEach((arg, i) => {
    const { value, error } = validateBaseOption(arg, detail.argv._[i]);

    if (error) {
      result.errors.push({ arg: arg.name, message: error });
    } else {
      result.args[arg.name] = value;
    }
  });

  return result;
}

export function parse<Options, Args>(
  argv: string[],
  cmd: Pick<Command<Options>, "options" | "args">,
  config: Partial<parser.Configuration> = {}
): ParseResult<Options, Args> {
  const detail = parser.detailed(argv, {
    configuration: config,
    ...getParserOptions(cmd.options || {})
  });

  const { options, errors: optErrors } = validateOptions(
    detail,
    cmd.options || {}
  );
  const { args, errors: argErrors } = validateArgs(detail, cmd.args || []);

  return {
    detail,
    options,
    args,
    errors: [...optErrors, ...argErrors]
  };
}
