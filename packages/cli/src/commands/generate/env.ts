import { Config } from "@kosko/config";
import { Environment } from "@kosko/env";
import { BaseGenerateArguments } from "./types";
import { createCLIEnvReducer } from "./set-option";
import pkgUp from "pkg-up";
import { dirname, join } from "node:path";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { excludeFalsyInArray } from "../../utils";
import { resolveModule } from "@kosko/require";
import {
  BUILD_FORMAT,
  BUILD_TARGET,
  ESM_IMPORT_DISABLED
} from "@kosko/build-scripts";

const KOSKO_ENV = "@kosko/env";

function pickEnvArray(envs: string[]): string | string[] | undefined {
  if (envs.length > 1) return envs;
  return envs[0];
}

async function importDefault(id: string) {
  const mod = await import(id);
  return mod.default;
}

async function getESMEntry(cwd: string) {
  const pkgPath = await pkgUp({ cwd });
  if (!pkgPath) return;

  const pkg = JSON.parse(await readFile(pkgPath, "utf-8"));
  if (!pkg.module) return;

  const path = join(pkgPath, "..", pkg.module);
  return pathToFileURL(path).toString();
}

async function importEnvNode(cwd: string): Promise<Environment[]> {
  const envPath = await resolveModule(KOSKO_ENV, { baseDir: cwd });

  if (!envPath) {
    throw new Error(`Failed to resolve path for "${KOSKO_ENV}"`);
  }

  const envs: Environment[] = [];

  if (BUILD_FORMAT === "cjs") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    envs.push(require(envPath));
  } else {
    // TODO: Import CommonJS @kosko/env in ESM environment
  }

  // Why `@kosko/env` package has to be imported twice? Because the cache on
  // CommonJS and ESM are separated, which means we have two isolated
  // instances of `Environment`, and each of them must be initialized
  // in order to make sure users can access the environment in both CommonJS
  // and ESM environment.
  if (!ESM_IMPORT_DISABLED) {
    const envModUrl = await getESMEntry(dirname(envPath));

    if (envModUrl) {
      envs.push(await importDefault(envModUrl));
    }
  }

  return envs;
}

async function importEnvGeneric(): Promise<Environment[]> {
  return [await importDefault(KOSKO_ENV)];
}

export async function setupEnv(
  config: Config,
  args: BaseGenerateArguments
): Promise<void> {
  const cwd = args.cwd;
  const envs =
    BUILD_TARGET === "node"
      ? await importEnvNode(cwd)
      : await importEnvGeneric();

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
