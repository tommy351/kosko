import { validate as sValidate, Failure } from "superstruct";
import { Config, configSchema } from "./types";

function formatErrors(failures: readonly Failure[]): string {
  return [
    'Config file "kosko.toml" is invalid.',
    ...failures.map((f) => `- "${f.path.join(".")}": ${f.message}`)
  ].join("\n");
}

export class ValidationError extends Error {
  constructor(public readonly errors: readonly Failure[]) {
    super(formatErrors(errors));
  }
}

ValidationError.prototype.name = "ValidationError";

/**
 * Validates data with kosko configuration schema. It throws a ValidationError
 * when validation failed.
 *
 * @param data
 */
export function validate(data: unknown): Config {
  const result = sValidate(data, configSchema);

  if (result[0]) {
    throw new ValidationError(result[0].failures());
  }

  return result[1];
}
