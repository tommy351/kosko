import { Struct, StructError, validate } from "superstruct";

/**
 * @public
 */
export class ConfigError extends Error {
  public constructor(err: StructError) {
    super("Invalid config");

    let stack = `${this.name}: ${this.message}`;

    for (const failure of err.failures()) {
      stack += `\n- ${failure.message}`;
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
  const [err, config] = validate(value, schema);
  if (!err) return config;

  throw new ConfigError(err);
}
