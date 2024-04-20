import { Issue, Manifest, Result, Severity } from "@kosko/generate";
import cleanStack from "clean-stack";
import pc from "picocolors";
import { CLIError } from "@kosko/cli-utils";
import { isRecord } from "@kosko/common-utils";
import { stderr } from "node:process";
import type { Formatter } from "picocolors/types";
import logger, { LogLevel } from "@kosko/log";

const severityFormats: Record<Severity, Formatter> = {
  error: pc.red,
  warning: pc.yellow
};

const severityIcons: Record<Severity, string> = {
  error: "✖",
  warning: "⚠"
};

function print(line: string): void {
  stderr.write(line + "\n");
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

export function resultHasError(result: Result): boolean {
  return result.manifests.some((manifest) =>
    manifest.issues.some((issue) => issue.severity === "error")
  );
}

function prettifyPath(cwd: string, path: string): string {
  if (path.startsWith(cwd)) {
    path = path.substring(cwd.length).replace(/^[/\\]+/, "");
  }

  return path.replace(/\\/g, "/");
}

interface IssueStats {
  error: number;
  warning: number;
}

function getIssueStats(manifest: Manifest): IssueStats {
  const stats: IssueStats = { error: 0, warning: 0 };

  for (const issue of manifest.issues) {
    stats[issue.severity]++;
  }

  return stats;
}

function printManifestHeader(cwd: string, manifest: Manifest): void {
  const { metadata, position } = manifest;
  const chunks: string[] = [];

  if (metadata) {
    chunks.push(`${metadata.apiVersion}/${metadata.kind}`);
    chunks.push(
      `${metadata.namespace ? metadata.namespace + "/" : ""}${metadata.name}`
    );
  }

  if (position.index.length) {
    chunks.push(`[${position.index.join(", ")}]`);
  }

  print(
    pc.underline(prettifyPath(cwd, position.path)) +
      (chunks.length ? ` - ${chunks.join(" ")}` : "")
  );
}

function printIssue(issue: Issue): void {
  const format = severityFormats[issue.severity];
  const icon = severityIcons[issue.severity];

  print(format(`${icon} ${issue.message}`));

  if (issue.cause) {
    const err = toErrorLike(issue.cause);
    if (!err) return;

    let stack = err.stack
      ? cleanStack(err.stack)
      : `${err.name}: ${err.message}`;

    stack = stack
      .split("\n")
      .map((line) => "  " + line)
      .join("\n");

    print(pc.gray(stack));
  }
}

function pluralize(count: number, word: string): string {
  return count === 1 ? word : word + "s";
}

function printSummary(stats: IssueStats): void {
  const chunks: string[] = [];

  if (stats.error) {
    chunks.push(`${stats.error} ${pluralize(stats.error, "error")}`);
  }

  if (stats.warning) {
    chunks.push(`${stats.warning} ${pluralize(stats.warning, "warning")}`);
  }

  if (!chunks.length) return;

  print("");

  logger.log(
    stats.error ? LogLevel.Error : LogLevel.Warn,
    `Found ${chunks.join(" and ")} in total`
  );
}

function createGenerateFailedError(): CLIError {
  return new CLIError("Generate failed", { output: "Generate failed" });
}

export function printIssues(cwd: string, result: Result): void {
  const totalStats: IssueStats = { error: 0, warning: 0 };

  for (const manifest of result.manifests) {
    if (!manifest.issues.length) continue;

    const stats = getIssueStats(manifest);
    totalStats.error += stats.error;
    totalStats.warning += stats.warning;

    print("");
    printManifestHeader(cwd, manifest);

    for (const issue of manifest.issues) {
      print("");
      printIssue(issue);
    }
  }

  printSummary(totalStats);

  if (totalStats.error) {
    throw createGenerateFailedError();
  }
}

function flattenError(err: unknown): unknown[] {
  if (err instanceof AggregateError) {
    return err.errors.flatMap(flattenError);
  }

  return [err];
}

export function handleGenerateError(err: unknown): void {
  const allErrors = flattenError(err);
  let count = 0;

  for (const value of allErrors) {
    const err = toErrorLike(value);
    if (!err) continue;

    count++;

    print("");
    print(
      severityFormats.error(
        `${severityIcons.error} ${err.name}: ${err.message}`
      )
    );

    if (err.stack) {
      const stack = cleanStack(err.stack).split("\n").slice(1).join("\n");

      print(pc.gray(stack));
    }
  }

  printSummary({ error: count, warning: 0 });
  throw createGenerateFailedError();
}
