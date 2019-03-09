import { ErrorObject } from "ajv";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ajvValidate = require("../dist/ajv-validate");

function formatErrors(errors: ErrorObject[]): string {
  if (!errors.length) return "No errors";
  return errors.map(err => `${err.dataPath} ${err.message}`).join(", ");
}

export class ValidationError extends Error {
  public constructor(public readonly errors: ErrorObject[]) {
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
export function validate(data: any): void {
  const valid = ajvValidate(data);
  if (valid) return;

  throw new ValidationError(ajvValidate.errors || []);
}
