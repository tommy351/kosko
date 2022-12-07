import { readdir } from "node:fs/promises";
import { join, posix } from "node:path";
import mm from "micromatch";

function createMatcher(patterns: readonly string[], baseOptions: mm.Options) {
  const positivePatterns: string[] = [];
  const negativePatterns: string[] = [];

  for (const pattern of patterns) {
    const parsed = mm.parse(pattern, baseOptions) as [
      { negated: boolean; consumed: string }
    ];

    if (parsed.length && parsed[0].negated) {
      negativePatterns.push(parsed[0].consumed);
    } else {
      positivePatterns.push(pattern);
    }
  }

  const options: mm.Options = {
    ...baseOptions,
    ignore: negativePatterns
  };

  return (path: string): boolean => {
    return mm.isMatch(path, positivePatterns, options);
  };
}

async function readDir(path: string) {
  const files = await readdir(path, { withFileTypes: true });

  return files.sort((a, b) => {
    if (a.name > b.name) {
      return 1;
    }

    if (a.name < b.name) {
      return -1;
    }

    return 0;
  });
}

export interface GlobOptions {
  path: string;
  patterns: readonly string[];
  extensions: readonly string[];
}

export interface GlobResult {
  relativePath: string;
  absolutePath: string;
}

export async function* glob(options: GlobOptions): AsyncIterable<GlobResult> {
  const matcherOptions: mm.Options = { cwd: options.path };
  const suffix =
    options.extensions.length > 1
      ? `.{${options.extensions.join(",")}}`
      : `.${options.extensions.join(",")}`;
  const dirMatcher = createMatcher(options.patterns, matcherOptions);
  const fileMatcher = createMatcher(
    options.patterns.map((pattern) => pattern + suffix),
    matcherOptions
  );

  async function* walk(
    path: string,
    parent: string
  ): AsyncIterable<GlobResult> {
    for (const file of await readDir(path)) {
      const result: GlobResult = {
        relativePath: posix.join(parent, file.name),
        absolutePath: join(path, file.name)
      };

      if (file.isDirectory()) {
        if (dirMatcher(result.relativePath)) {
          yield result;
        }

        yield* walk(result.absolutePath, result.relativePath);
      } else if (fileMatcher(result.relativePath)) {
        yield result;
      }
    }
  }

  yield* walk(options.path, "");
}
