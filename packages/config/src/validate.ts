import { ErrorObject } from "ajv";

// tslint:disable-next-line:no-var-requires
const ajvValidate = require("../dist/ajv-validate");

export class ValidationError extends Error {
  constructor(public readonly errors: ErrorObject[]) {
    super(formatErrors(errors));
  }
}

function formatErrors(errors: ErrorObject[]): string {
  if (!errors.length) return "No errors";
  return errors.map(err => `${err.dataPath} ${err.message}`).join(", ");
}

export function validate(data: any) {
  const valid = ajvValidate(data);
  if (valid) return;

  throw new ValidationError(ajvValidate.errors || []);
}
