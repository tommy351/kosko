import { Reducer } from "@kosko/env";
import { isRecord, toArray } from "@kosko/utils";
import jp from "jsonpath";
import stringify from "fast-safe-stringify";
import { CLIError } from "../../cli/error";

/**
 * Contains a value to override a variable of the specified component
 * by the specified key.
 *
 * @internal
 */
export interface SetOption {
  componentName?: string;
  key: string;
  value: string;
}

// Splits strings like `something[a==b]=c` into `something[a==b]` and `c`
const parseRegexp = /^(.*?[^=<>~])=([^=<>~].*?$)/;

function parseSetOptionValue(value: string): string {
  try {
    const parsed = JSON.parse(value) as unknown;
    return typeof parsed === "string" ? parsed : value;
  } catch (e) {
    // if value is not a valid JSON, then it
    // is considered to be a plain string
    return value;
  }
}

function parseKeyValuePair(s: unknown): SetOption {
  // s has unknown type because yargs converts a string
  // to a number in case of nested objects
  if (typeof s !== "string") {
    throw new Error(`The specified value ${stringify(s)} is not a string.`);
  }

  const matches = s.match(parseRegexp);

  if (matches == null || matches.length !== 3) {
    throw new Error(
      `Cannot parse string "${s}". Expected format is "<key>=<value>".`
    );
  }

  return {
    key: matches[1],
    value: parseSetOptionValue(matches[2])
  };
}

/**
 * Parses arguments provided by `yargs-parser` into a list of key-value pairs
 * for components.
 *
 * @param arg - Arguments provided by `yargs-parser`.
 * @internal
 */
export function parseSetOptions(arg: unknown): SetOption[] {
  const result: SetOption[] = [];
  const argsArray: unknown[] = Array.isArray(arg) ? arg : [arg];

  for (const argItem of argsArray) {
    // if item is an object then it contains component variables
    if (isRecord(argItem)) {
      // for each component there is a key in the object
      for (const argKey of Object.keys(argItem)) {
        // if only one value is specified then argValues is a string
        // if multiple values are specified then argValues is an array
        const argValues = toArray(argItem[argKey]);

        for (const value of argValues) {
          result.push({
            ...parseKeyValuePair(value),
            componentName: argKey
          });
        }
      }
    }
    // otherwise it's a global variable
    else {
      result.push(parseKeyValuePair(argItem));
    }
  }

  return result;
}

/**
 * Creates a reducer from the specified set arguments.
 *
 * @param setOptions - List of set arguments.
 * @internal
 */
export function createCLIEnvReducer(setOptions: SetOption[]): Reducer {
  // Try to parse and see if the JSON path is invalid
  for (const opt of setOptions) {
    try {
      jp.parse(opt.key);
    } catch (err) {
      const message = `Invalid JSONPath expression "${opt.key}"`;
      const reason =
        isRecord(err) && typeof err.message === "string" ? err.message : "";

      throw new CLIError(message, {
        code: 1,
        output: reason ? `${message}: ${reason}` : message
      });
    }
  }

  // reorder arguments to ensure that global overrides will be applied
  // before the component ones
  const argsOrdered = setOptions.sort((a, b) =>
    a.componentName === b.componentName ? 0 : a.componentName ? 1 : -1
  );

  const reducer: Reducer = {
    name: "cli",
    reduce(target: Record<string, any>, componentName?: string) {
      for (const variable of argsOrdered) {
        const isGlobalVariable = !variable.componentName;

        if (isGlobalVariable || variable.componentName === componentName) {
          jp.apply(target, "$." + variable.key, () => variable.value);
        }
      }

      return target;
    }
  };

  return reducer;
}
