import AggregateError from "@kosko/aggregate-error";
import { GenerateError, ResolveError } from "@kosko/generate";
import cleanStack from "clean-stack";
import extractStack from "extract-stack";
import pc from "picocolors";
import { CLIError } from "../../cli/error";
import stringify from "fast-safe-stringify";
import { isRecord } from "@kosko/common-utils";
import { stderr } from "node:process";
import { BaseGenerateArguments } from "./types";

function flattenError(err: unknown): unknown[] {
  if (err instanceof AggregateError) {
    return err.errors.flatMap(flattenError);
  }

  return [err];
}

function print(line: string): void {
  stderr.write(line + "\n");
}

function getErrorCount(n: number): string {
  return `${n} error${n === 1 ? "" : "s"}`;
}

interface ErrorLike {
  name: string;
  message: string;
  stack?: string;
}

function toErrorLike(err: unknown): ErrorLike | undefined {
  if (err instanceof Error) return err;

  if (isRecord(err)) {
    const { name, message, stack } = err;

    if (typeof message === "string") {
      return {
        name: (typeof name === "string" && name) || "Error",
        message,
        ...(typeof stack === "string" && { stack })
      };
    }
  }

  if (typeof err === "string") {
    return { name: "Error", message: err };
  }
}

// https://github.com/ajv-validator/ajv/blob/v8.11.0/lib/types/index.ts#L85
interface AjvErrorObject {
  instancePath: string;
  message?: string;
  params: unknown;
  keyword: "type" | "enum" | "oneOf";
}

// https://github.com/ajv-validator/ajv/blob/v8.11.0/lib/runtime/validation_error.ts
interface AjvValidationErrorLike {
  errors: readonly AjvErrorObject[];
}

function isAjvValidationErrorLike(
  value: unknown
): value is AjvValidationErrorLike {
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

function getFormattedErrorTitle(err: ErrorLike) {
  return "  " + pc.red(`✖ ${err.name}: ${err.message}`);
}

function getFormattedErrorStack(err: ErrorLike, extraIndent = "") {
  if (typeof err.stack !== "string") return;

  let stack = cleanStack(extractStack(err));

  if (extraIndent) {
    stack = stack
      .split("\n")
      .map((line) => extraIndent + line)
      .join("\n");
  }

  return pc.gray(stack);
}

function stringifyCause(cause: unknown) {
  if (isAjvValidationErrorLike(cause)) {
    return (
      "\n" +
      cause.errors
        .map((err) => `      ${stringifyAjvErrorObject(err)}`)
        .join("\n")
    );
  }

  const err = toErrorLike(cause);
  if (!err) return;

  return [
    `    ${err.name}: ${err.message}`,
    getFormattedErrorStack(err, "  ")
  ].join("\n");
}

function stringifyResolveError(err: ResolveError): string {
  const lines: string[] = [getFormattedErrorTitle(err)];

  function appendMeta(name: string, value: string) {
    lines.push(`    ${name}: ${value}`);
  }

  if (err.index?.length) {
    appendMeta("Index", `[${err.index.join(", ")}]`);
  }

  if (err.component) {
    const { apiVersion, kind, name, namespace } = err.component;

    appendMeta("Kind", `${apiVersion}/${kind}`);
    if (namespace) appendMeta("Namespace", namespace);
    appendMeta("Name", name);
  }

  const cause = stringifyCause(err.cause);
  if (cause) lines.push(cause);

  return lines.join("\n");
}

export function handleGenerateError(
  cwd: string,
  error: unknown,
  options: Pick<BaseGenerateArguments, "bail">
) {
  const allErrors = flattenError(error);
  const pathErrorsMap: Record<string, string[]> = {};
  const unknownErrors: ErrorLike[] = [];

  function pushToPathErrorsMap(path: string, value: string) {
    pathErrorsMap[path] ??= [];
    pathErrorsMap[path].push(value);
  }

  function prettifyPath(path: string): string {
    if (path.startsWith(cwd)) {
      path = path.substring(cwd.length).replace(/^[/\\]+/, "");
    }

    return path.replace(/\\/g, "/");
  }

  for (const err of allErrors) {
    if (err instanceof ResolveError && err.path) {
      pushToPathErrorsMap(err.path, stringifyResolveError(err));
    } else if (err instanceof GenerateError && err.path) {
      pushToPathErrorsMap(err.path, stringifyResolveError(err));
    } else {
      const e = toErrorLike(err);
      if (e) unknownErrors.push(e);
    }
  }

  for (const [path, errors] of Object.entries(pathErrorsMap)) {
    print(`${pc.bold(prettifyPath(path))} - ${getErrorCount(errors.length)}\n`);

    for (const err of errors) {
      print(err + "\n");
    }
  }

  if (unknownErrors.length) {
    print(pc.bold(`Other ${getErrorCount(unknownErrors.length)}\n`));

    for (const err of unknownErrors) {
      const stack = getFormattedErrorStack(err);

      print(`${getFormattedErrorTitle(err)}\n`);
      if (stack) print(`${stack}\n`);
    }
  }

  return new CLIError("Generate failed", {
    output: `Generate failed (${
      options.bail
        ? "Only the first error is displayed because `bail` option is enabled"
        : `Total ${getErrorCount(allErrors.length)}`
    })`
  });
}
