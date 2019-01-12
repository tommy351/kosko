import Ajv, { ErrorObject } from "ajv";

const ajv = new Ajv({ schemaId: "auto" });

// tslint:disable-next-line:no-var-requires
ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-04.json"));

// tslint:disable-next-line:no-var-requires
const ajvValidate = ajv.compile(require("../assets/schema.json"));

export class ValidationError extends Error {
  constructor(public readonly errors: ErrorObject[]) {
    super(ajv.errorsText(errors));
  }
}

export function validate(data: any) {
  const valid = ajvValidate(data);
  if (valid) return;

  throw new ValidationError(ajvValidate.errors || []);
}
