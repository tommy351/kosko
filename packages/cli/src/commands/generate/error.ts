import AggregateError from "@kosko/aggregate-error";
import { GenerateError, ResolveError } from "@kosko/generate";
import cleanStack from "clean-stack";
import extractStack from "extract-stack";
import pc from "picocolors";
import { CLIError } from "../../cli/error";

function flattenError(err: unknown): unknown[] {
  if (err instanceof AggregateError) {
    return err.errors.flatMap(flattenError);
  }

  return [err];
}

function print(line: string): void {
  process.stderr.write(line + "\n");
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

  if (typeof err === "object" && err != null) {
    const { name, message, stack } = err as any;

    if (typeof name === "string" && typeof message === "string") {
      return { name, message, ...(typeof stack === "string" && { stack }) };
    }
  }

  if (typeof err === "string") {
    return { name: "Error", message: err };
  }
}

function getFormattedErrorTitle(err: ErrorLike) {
  return "  " + pc.red(`✖ ${err.name}: ${err.message}`);
}

function getFormattedErrorStack(err: ErrorLike, extraIndent = "") {
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

export function handleGenerateError(cwd: string, error: unknown) {
  const allErrors = flattenError(error);
  const pathErrorsMap: Record<string, string[]> = {};
  const unknownErrors: ErrorLike[] = [];

  function pushToPathErrorsMap(path: string, value: string) {
    pathErrorsMap[path] ??= [];
    pathErrorsMap[path].push(value);
  }

  function prettifyPath(path: string): string {
    if (path.startsWith(cwd)) {
      return path.substring(cwd.length).replace(/^[/\\]+/, "");
    }

    return path;
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
      print(
        getFormattedErrorTitle(err) + "\n" + getFormattedErrorStack(err) + "\n"
      );
    }
  }

  return new CLIError("Generate failed", {
    output: `Generate failed (Total ${getErrorCount(allErrors.length)})`
  });
}
