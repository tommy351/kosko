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

function groupManifestsByPath(
  manifests: readonly Manifest[]
): Record<string, Manifest[]> {
  const groups: Record<string, Manifest[]> = {};

  // Group manifests by path
  for (const manifest of manifests) {
    if (manifest.issues.length) {
      groups[manifest.path] ??= [];
      groups[manifest.path].push(manifest);
    }
  }

  return groups;
}

interface IssueStats {
  error: number;
  warning: number;
}

function getIssueStats(manifests: Manifest[]): IssueStats {
  const stats: IssueStats = { error: 0, warning: 0 };

  for (const manifest of manifests) {
    for (const issue of manifest.issues) {
      stats[issue.severity]++;
    }
  }

  return stats;
}

function stringifyIssueStats(stats: IssueStats): string {
  const chunks: string[] = [];

  for (const severity of ["error", "warning"] as const) {
    const count = stats[severity];

    if (count) {
      chunks.push(
        severityFormats[severity](`${severityIcons[severity]} ${count}`)
      );
    }
  }

  return chunks.join(", ");
}

function printIssueStats(path: string, stats: IssueStats): void {
  print(`${pc.bold(path)} - ${stringifyIssueStats(stats)}\n`);
}

function printManifestHeader(manifest: Manifest): void {
  const { component, index } = manifest;
  const chunks: string[] = [];

  if (component) {
    chunks.push(`Kind: ${component.apiVersion}/${component.kind}`);
    chunks.push(
      `Name: ${component.namespace ? component.namespace + "/" : ""}${component.name}`
    );
  }

  if (index.length) {
    chunks.push(`Index: [${index.join(", ")}]`);
  }

  if (chunks.length) {
    print("  " + chunks.join(", "));
  }
}

function printIssue(issue: Issue): void {
  const format = severityFormats[issue.severity];
  const icon = severityIcons[issue.severity];

  print(`    ${format(icon)} ${issue.message}`);

  if (issue.cause) {
    const err = toErrorLike(issue.cause);
    if (!err) return;

    let stack = err.stack
      ? cleanStack(err.stack)
      : `${err.name}: ${err.message}`;

    stack = stack
      .split("\n")
      .map((line) => "      " + line)
      .join("\n");

    print(pc.gray(stack));
  }
}

export function printIssues(cwd: string, result: Result): void {
  const manifestsByPath = groupManifestsByPath(result.manifests);
  const totalStats: IssueStats = { error: 0, warning: 0 };

  for (const [path, manifests] of Object.entries(manifestsByPath)) {
    const stats = getIssueStats(manifests);

    if (stats.error) {
      totalStats.error += stats.error;
      totalStats.warning += stats.warning;
    }

    printIssueStats(prettifyPath(cwd, path), stats);

    for (const manifest of manifests) {
      printManifestHeader(manifest);

      for (const issue of manifest.issues) {
        printIssue(issue);
      }

      print("");
    }
  }

  if (totalStats.error) {
    throw new CLIError("Generate failed", {
      output: `Generate failed (Total ${stringifyIssueStats(totalStats)})`
    });
  } else if (totalStats.warning) {
    logger.log(
      LogLevel.Warn,
      `Generate completed with warnings (Total ${stringifyIssueStats(totalStats)})`
    );
  }
}
