import { isRecord } from "@kosko/common-utils";
import stringify from "fast-safe-stringify";
import { Issue } from "./base";

// https://github.com/ajv-validator/ajv/blob/v8.11.0/lib/types/index.ts#L85
export interface AjvErrorObject {
  instancePath: string;
  message?: string;
  params: unknown;
  keyword: "type" | "enum" | "oneOf";
}

// https://github.com/ajv-validator/ajv/blob/v8.11.0/lib/runtime/validation_error.ts
export interface AjvValidationError {
  errors: readonly AjvErrorObject[];
}

export function isAjvValidationError(
  value: unknown
): value is AjvValidationError {
  return (
    isRecord(value) &&
    value.ajv === true &&
    value.validation === true &&
    Array.isArray(value.errors)
  );
}

function stringifyAjvErrorObject(err: AjvErrorObject) {
  let msg = err.instancePath;

  if (err.message) {
    msg += ` ${err.message}`;
  }

  if (
    err.keyword === "enum" &&
    isRecord(err.params) &&
    Array.isArray(err.params.allowedValues)
  ) {
    msg += `: ${stringify(err.params.allowedValues)}`;
  }

  return msg;
}

export function ajvValidationErrorToIssues(err: AjvValidationError): Issue[] {
  return err.errors.map((error) => ({
    message: stringifyAjvErrorObject(error),
    severity: "error"
  }));
}
