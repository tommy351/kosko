import AggregateError from "@kosko/aggregate-error";
import { isRecord } from "@kosko/common-utils";
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

/**
 * @public
 */
export interface ComponentInfo {
  apiVersion: string;
  kind: string;
  name: string;
  namespace?: string;
}

function isComponent(value: unknown): value is Component {
  if (!isRecord(value)) return false;

  const { apiVersion, kind, metadata } = value;

  return (
    typeof apiVersion === "string" &&
    typeof kind === "string" &&
    isRecord(metadata) &&
    typeof metadata.name === "string"
  );
}

export function aggregateErrors(errors: unknown[]) {
  if (errors.length === 1) {
    return errors[0];
  }

  return new AggregateError(errors);
}

function decorateErrorStack(err: Error, values: Record<string, string>) {
  const origStack = extractStack(err.stack);
  err.stack = `${err.name}: ${err.message}`;

  for (const [key, value] of Object.entries(values)) {
    err.stack += `\n${STACK_INDENT}${key}: ${value}`;
  }

  if (origStack) err.stack += "\n" + origStack;
}

function generateCauseMessage(cause: unknown) {
  if (typeof cause === "string") return cause;

  if (isRecord(cause)) {
    const { name, message, stack } = cause;

    if (typeof message !== "string") {
      return;
    }

    let result = `${(typeof name === "string" && name) || "Error"}: ${message}`;

    if (typeof stack === "string") {
      const extracted = extractStack(stack);

      if (extracted) {
        result +=
          "\n" +
          extracted
            .split("\n")
            .map((line) => STACK_INDENT + line)
            .join("\n");
      }
    }

    return result;
  }
}

/**
 * @public
 */
export interface ResolveErrorOptions {
  path?: string;
  index?: number[];
  cause?: unknown;
  value?: unknown;
}

/**
 * @public
 */
export class ResolveError extends Error {
  public readonly path?: string;
  public readonly index?: number[];
  public readonly cause?: unknown;
  public readonly value?: unknown;
  public readonly component?: ComponentInfo;

  public constructor(message: string, options: ResolveErrorOptions = {}) {
    super(message);

    this.path = options.path;
    this.index = options.index;
    this.cause = options.cause;
    this.value = options.value;

    if (isComponent(this.value)) {
      this.component = {
        apiVersion: this.value.apiVersion,
        kind: this.value.kind,
        name: this.value.metadata.name,
        namespace: this.value.metadata.namespace
      };
    }

    const cause = generateCauseMessage(this.cause);

    decorateErrorStack(this, {
      ...(this.path && { Path: this.path }),
      ...(this.index?.length && { Index: `[${this.index.join(", ")}]` }),
      ...(this.component && {
        Kind: `${this.component.apiVersion}/${this.component.kind}`,
        ...(this.component.namespace && {
          Namespace: this.component.namespace
        }),
        Name: this.component.name
      }),
      ...(cause && { Cause: cause })
    });
  }
}

ResolveError.prototype.name = "ResolveError";

/**
 * @public
 */
export interface GenerateErrorOptions {
  path?: string;
  cause?: unknown;
}

/**
 * @public
 */
export class GenerateError extends Error {
  public readonly path?: string;
  public readonly cause?: unknown;

  constructor(message: string, options: GenerateErrorOptions = {}) {
    super(message);

    this.path = options.path;
    this.cause = options.cause;

    const cause = generateCauseMessage(this.cause);

    decorateErrorStack(this, {
      ...(this.path && { Path: this.path }),
      ...(cause && { Cause: cause })
    });
  }
}

GenerateError.prototype.name = "GenerateError";
