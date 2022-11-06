import { validate as sValidate, Failure } from "superstruct";
import { Config, configSchema } from "./types";

function formatErrors(failures: readonly Failure[]): string {
  return [
    'Config file "kosko.toml" is invalid.',
    ...failures.map((f) => `- "${f.path.join(".")}": ${f.message}`)
  ].join("\n");
}

/**
 * @public
 */
export class ValidationError extends Error {
  /**
   * An array of {@link https://docs.superstructjs.org/api-reference/errors | superstruct error objects}.
   */
  public readonly errors: readonly Failure[];

  constructor(errors: readonly Failure[]) {
    super(formatErrors(errors));

    this.errors = errors;
  }
}

ValidationError.prototype.name = "ValidationError";

/**
 * Validates data against the configuration schema. It throws a {@link ValidationError}
 * when validation failed.
 *
 * @public
 */
export function validate(data: unknown): Config {
  const result = sValidate(data, configSchema);

  if (result[0]) {
    throw new ValidationError(result[0].failures());
  }

  return result[1];
}
