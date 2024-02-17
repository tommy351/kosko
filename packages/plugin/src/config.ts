import { Struct, StructError, validate } from "superstruct";

class ConfigError extends Error {
  public constructor(err: StructError) {
    super("Invalid config");

    let stack = `${this.name}: Invalid config`;

    for (const failure of err.failures()) {
      stack += `\n- ${failure.message}`;
    }

    this.stack = stack;
  }
}

ConfigError.prototype.name = "ConfigError";

/**
 * @public
 */
export function validateConfig<T>(value: unknown, schema: Struct<T>): T {
  const [err, config] = validate(value, schema);
  if (!err) return config;

  throw new ConfigError(err);
}
