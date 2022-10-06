import AggregateError from "@kosko/aggregate-error";
import extractStack from "extract-stack";

const STACK_INDENT = "    ";

interface Component {
  apiVersion: string;
  kind: string;
  metadata: {
    name: string;
    namespace?: string;
  };
}

function isComponent(value: unknown): value is Component {
  if (value == null || typeof value !== "object") return false;

  const { apiVersion, kind, metadata = {} } = value as any;

  return (
    typeof apiVersion === "string" &&
    typeof kind === "string" &&
    typeof metadata.name === "string"
  );
}

export interface ResolveErrorOptions {
  path?: string;
  index?: number[];
  cause?: Error;
  value?: unknown;
}

export function toError(value: unknown): Error {
  if (value instanceof Error) {
    return value;
  }

  if (typeof value === "string") {
    return new Error(value);
  }

  if (typeof value === "object" && value != null) {
    return Object.assign(new Error((value as any).message), value);
  }

  return new Error();
}

export function aggregateErrors(errors: Error[]) {
  if (errors.length === 1) {
    return errors[0];
  }

  return new AggregateError(errors);
}

function decorateErrorStack(
  err: Error,
  values: Record<string, string>
): string {
  const origStack = extractStack(err.stack);
  let stack = `${err.name}: ${err.message}`;

  for (const [key, value] of Object.entries(values)) {
    stack += `\n${STACK_INDENT}${key}: ${value}`;
  }

  if (origStack) stack += "\n" + origStack;

  return stack;
}

function generateCauseMessage(cause: Error): string {
  const causeStack = extractStack(cause);
  let msg = `${cause.name}: ${cause.message}`;

  if (causeStack) {
    msg +=
      "\n" +
      causeStack
        .split("\n")
        .map((line) => STACK_INDENT + line)
        .join("\n");
  }

  return msg;
}

export class ResolveError extends Error {
  public readonly path?: string;
  public readonly index?: number[];
  public readonly cause?: Error;
  public readonly value?: unknown;

  public constructor(message: string, options: ResolveErrorOptions = {}) {
    super(message);

    this.path = options.path;
    this.index = options.index;
    this.cause = options.cause;
    this.value = options.value;
    this.stack = decorateErrorStack(this, {
      ...(this.path && { Path: this.path }),
      ...(this.index?.length && { Index: `[${this.index.join(", ")}]` }),
      ...(isComponent(this.value) && {
        Kind: `${this.value.apiVersion}/${this.value.kind}`,
        ...(typeof this.value.metadata.namespace === "string" && {
          Namespace: this.value.metadata.namespace
        }),
        Name: this.value.metadata.name
      }),
      ...(this.cause && { Cause: generateCauseMessage(this.cause) })
    });
  }
}

ResolveError.prototype.name = "ResolveError";

export interface GenerateErrorOptions {
  path?: string;
  cause?: Error;
}

export class GenerateError extends Error {
  public readonly path?: string;
  public readonly cause?: Error;

  constructor(message: string, options: GenerateErrorOptions = {}) {
    super(message);

    this.path = options.path;
    this.cause = options.cause;
    this.stack = decorateErrorStack(this, {
      ...(this.path && { Path: this.path }),
      ...(this.cause && { Cause: generateCauseMessage(this.cause) })
    });
  }
}

GenerateError.prototype.name = "GenerateError";
