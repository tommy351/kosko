import { Config } from "@kosko/config";
import { Environment } from "@kosko/env";
import { localImportDefault, localRequireDefault } from "./require";
import { BaseGenerateArguments } from "./types";
import { isESMSupported } from "@kosko/require";
import { createCLIEnvReducer } from "./set-option";

const KOSKO_ENV = "@kosko/env";

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
  const envs: Environment[] = [
    (await localRequireDefault(KOSKO_ENV, cwd)) as Environment
  ];

  if (await isESMSupported()) {
    // Why `@kosko/env` package has to be imported twice? Because the cache on
    // CommonJS and ESM are separated, which means we have two isolated
    // instances of `Environment`, and each of them must be initialized
    // in order to make sure users can access the environment in both CommonJS
    // and ESM environment.
    envs.push((await localImportDefault(KOSKO_ENV, cwd)) as Environment);
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

    if (paths.global) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      env.paths.global = paths.global;
    }

    if (paths.component) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      env.paths.component = paths.component;
    }

    if (setReducer) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      env.setReducers((reducers) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
        return [...reducers, setReducer];
      });
    }
  }
}
