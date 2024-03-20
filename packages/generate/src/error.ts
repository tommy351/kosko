import {
  isRecord,
  getManifestMeta,
  type ManifestMeta
} from "@kosko/common-utils";
import extractStack from "extract-stack";
import type { ManifestPosition } from "./base";

const STACK_INDENT = "    ";

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
  position?: ManifestPosition;
  cause?: unknown;
  value?: unknown;
}

/**
 * @public
 */
export class ResolveError extends Error {
  public readonly position?: ManifestPosition;
  public readonly metadata?: ManifestMeta;
  public readonly cause?: unknown;
  public readonly value?: unknown;

  public constructor(message: string, options: ResolveErrorOptions = {}) {
    super(message);

    this.position = options.position;
    this.cause = options.cause;
    this.value = options.value;
    this.metadata = getManifestMeta(this.value);

    const cause = generateCauseMessage(this.cause);

    decorateErrorStack(this, {
      ...(this.position && {
        Path: this.position.path,
        ...(this.position.index.length && {
          Index: `[${this.position.index.join(", ")}]`
        })
      }),
      ...(this.metadata && {
        Kind: `${this.metadata.apiVersion}/${this.metadata.kind}`,
        ...(this.metadata.namespace && {
          Namespace: this.metadata.namespace
        }),
        Name: this.metadata.name
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
