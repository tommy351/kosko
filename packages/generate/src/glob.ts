import { readdir } from "fs/promises";
import { join, posix } from "path";
import mm from "micromatch";

function createMatcher(patterns: readonly string[], options?: mm.Options) {
  const matchers = patterns.map((pattern) => mm.matcher(pattern, options));
  return (path: string): boolean => matchers.some((matcher) => matcher(path));
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
  const fileMatcher = createMatcher(
    options.patterns.map((pattern) => pattern + suffix),
    matcherOptions
  );
  const dirMatcher = createMatcher(options.patterns, matcherOptions);

  async function* walk(
    path: string,
    parent: string
  ): AsyncIterable<GlobResult> {
    for (const file of await readdir(path, { withFileTypes: true })) {
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
