import { Struct, StructError, create } from "superstruct";

/**
 * @public
 */
export class ConfigError extends Error {
  public constructor(public readonly cause: StructError) {
    super("Invalid config");

    let stack = `${this.name}: ${this.message}`;

    for (const failure of cause.failures()) {
      stack += `\n- ${failure.path.join(".")}: ${failure.message}`;
    }

    this.stack = stack;
  }
}

ConfigError.prototype.name = "ConfigError";

/**
 * Validate a value against a schema.
 *
 * @public
 *
 * @throws ConfigError
 * Thrown if the value is invalid.
 */
export function validateConfig<T>(value: unknown, schema: Struct<T>): T {
  try {
    return create(value, schema);
  } catch (err) {
    if (err instanceof StructError) {
      throw new ConfigError(err);
    }

    throw err;
  }
}
