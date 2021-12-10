import { Reducer } from "@kosko/env";
import jp from "jsonpath";
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

function parseSetOptionValue(value: string): any {
  try {
    return JSON.parse(value);
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
    throw new Error(`The specified value "${s}" is not a string.`);
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
 * @param arg Arguments provided by `yargs-parser`.
 * @internal
 */
export function parseSetOptions(arg: unknown): SetOption[] {
  const result: SetOption[] = [];
  const argsArray: unknown[] = Array.isArray(arg) ? arg : [arg];

  for (const argItem of argsArray) {
    // if item is an object then it contains component variables
    if (typeof argItem === "object" && argItem !== null) {
      // for each component there is a key in the object
      for (const argKey of Object.keys(argItem)) {
        // if only one value is specified then argValues is a string
        // if multiple values are specified then argValues is an array
        let argValues = (argItem as any)[argKey];

        // wrap a single string value to the array so we can
        // unify futher processing
        if (!Array.isArray(argValues)) {
          argValues = [argValues];
        }

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
 * @param setOptions List of set arguments.
 * @internal
 */
export function createCLIEnvReducer(setOptions: SetOption[]): Reducer {
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
          try {
            jp.apply(target, "$." + variable.key, () => variable.value);
          } catch (e: any) {
            throw new CLIError(e.message, {
              code: 1,
              output: `Failed to override key "${variable.key}". ${e.message}`
            });
          }
        }
      }

      return target;
    }
  };

  return reducer;
}
