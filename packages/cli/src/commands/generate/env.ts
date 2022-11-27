import { Config } from "@kosko/config";
import { Environment } from "@kosko/env";
import { BaseGenerateArguments } from "./types";
import { createCLIEnvReducer } from "./set-option";
import pkgDir from "pkg-dir";
import resolveFrom from "resolve-from";

const KOSKO_ENV =
  // eslint-disable-next-line no-restricted-globals
  process.env.BUILD_TARGET === "deno" ? "npm:@kosko/env@^4" : "@kosko/env";

function excludeFalsyInArray<T>(input: (T | undefined | null)[]): T[] {
  return input.filter(Boolean) as T[];
}

function pickEnvArray(envs: string[]): string | string[] | undefined {
  if (envs.length > 1) return envs;
  return envs[0];
}

export async function setupEnv(
  config: Config,
  args: BaseGenerateArguments
): Promise<void> {
  const cwd = args.cwd;
  const envs: Environment[] = [];

  // eslint-disable-next-line no-restricted-globals
  switch (process.env.BUILD_TARGET) {
    case "node": {
      const envPath = resolveFrom(cwd, KOSKO_ENV);
      const envDir = await pkgDir(envPath);

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      envs.push(require(envPath));

      // Why `@kosko/env` package has to be imported twice? Because the cache on
      // CommonJS and ESM are separated, which means we have two isolated
      // instances of `Environment`, and each of them must be initialized
      // in order to make sure users can access the environment in both CommonJS
      // and ESM environment.
      if (envDir) {
        envs.push(await import(envDir).then((mod) => mod.default));
      }

      break;
    }
    case "deno":
      envs.push(await import(KOSKO_ENV).then((mod) => mod.default));
      break;
  }

  const paths = config.paths?.environment || {};
  const setReducer = args.set?.length
    ? createCLIEnvReducer(args.set)
    : undefined;

  // Initialize all environments
  for (const env of envs) {
    env.cwd = cwd;
    env.env = pickEnvArray(
      excludeFalsyInArray([config.baseEnvironment, args.env])
    );

    if (config.extensions) env.extensions = [...config.extensions];

    if (paths.global) env.paths.global = paths.global;
    if (paths.component) env.paths.component = paths.component;

    if (setReducer) {
      env.setReducers((reducers) => [...reducers, setReducer]);
    }
  }
}
