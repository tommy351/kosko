import { LoadOptions, loadString, Manifest } from "@kosko/yaml";
import {
  spawn,
  booleanArg,
  stringArg,
  stringArrayArg
} from "@kosko/exec-utils";
import { getErrorCode } from "@kosko/common-utils";
import assert from "node:assert";

const BUILD_COMMANDS: readonly (readonly string[])[] = [
  ["kustomize", "build"],
  ["kubectl", "kustomize"]
];

let cachedBuildCommand: readonly string[] | undefined;

/** @internal */
export function resetCachedBuildCommand() {
  cachedBuildCommand = undefined;
}

function isENOENTError(err: unknown) {
  return getErrorCode(err) === "ENOENT";
}

/**
 * @public
 */
export interface KustomizeOptions extends LoadOptions {
  /**
   * The path to a directory containing `kustomization.yaml`, or a Git repository
   * URL with a suffix specifying same with respect to the repository root.
   */
  path: string;

  /**
   * Use the uid and gid of the command executor to run the function in the container.
   */
  asCurrentUser?: boolean;

  /**
   * Enable kustomize plugins.
   */
  enableAlphaPlugins?: boolean;

  /**
   * Enable support for exec functions (raw executables); do not use for
   * untrusted configs! (Alpha)
   */
  enableExec?: boolean;

  /**
   * Enable use of the Helm chart inflator generator.
   */
  enableHelm?: boolean;

  /**
   * Enable adding `app.kubernetes.io/managed-by` label.
   */
  enableManagedByLabel?: boolean;

  /**
   * Enable support for starlark functions. (Alpha)
   */
  enableStar?: boolean;

  /**
   * A list of environment variables to be used by functions.
   */
  env?: Record<string, string>;

  /**
   * Helm command (path to executable).
   *
   * @defaultValue `helm`
   */
  helmCommand?: string;

  /**
   * If set to `LoadRestrictionsNone`, local kustomizations may load files from
   * outside their root. This does, however, break the relocatability of the
   * kustomization.
   *
   * @defaultValue `LoadRestrictionsRootOnly`
   */
  loadRestrictor?: string;

  /**
   * A list of storage options read from the filesystem.
   */
  mount?: string[];

  /**
   * Enable network access for functions that declare it.
   */
  network?: boolean;

  /**
   * The docker network to run the container in.
   *
   * @defaultValue `bridge`
   */
  networkName?: string;

  /**
   * Reorder the resources just before output. Use `legacy` to apply a legacy
   * reordering (Namespaces first, Webhooks last, etc). Use `none` to suppress a
   * final reordering.
   *
   * @defaultValue `legacy`
   */
  reorder?: string;

  /**
   * The command to build Kustomize files.
   *
   * @defaultValue
   * It will try `kustomize build` first, and fallback to `kubectl kustomize` if
   * `kustomize` executable does not exist.
   */
  buildCommand?: readonly string[];
}

/**
 * @public
 */
export function loadKustomize(
  options: KustomizeOptions
): () => Promise<Manifest[]> {
  const {
    path,
    asCurrentUser,
    enableAlphaPlugins,
    enableExec,
    enableHelm,
    enableManagedByLabel,
    enableStar,
    env,
    helmCommand,
    loadRestrictor,
    mount,
    network,
    networkName,
    reorder,
    transform,
    buildCommand
  } = options;

  if (buildCommand) {
    assert(buildCommand.length, "buildCommand must not be empty");
  }

  const buildArgs = [
    path,
    ...booleanArg("as-current-user", asCurrentUser),
    ...booleanArg("enable-alpha-plugins", enableAlphaPlugins),
    ...booleanArg("enable-exec", enableExec),
    ...booleanArg("enable-helm", enableHelm),
    ...booleanArg("enable-managedby-label", enableManagedByLabel),
    ...booleanArg("enable-star", enableStar),
    ...(env
      ? stringArrayArg(
          "env",
          Object.entries(env).map(([k, v]) => `${k}=${v}`)
        )
      : []),
    ...stringArg("helm-command", helmCommand),
    ...stringArg("load-restrictor", loadRestrictor),
    ...stringArrayArg("mount", mount),
    ...booleanArg("network", network),
    ...stringArg("network-name", networkName),
    ...stringArg("reorder", reorder)
  ];

  function runKustomize([command, ...rest]: readonly string[]) {
    return spawn(command, [...rest, ...buildArgs]);
  }

  return async () => {
    const { stdout } = await (async () => {
      // Run with provided build command
      if (buildCommand) {
        try {
          return await runKustomize(buildCommand);
        } catch (err) {
          if (!isENOENTError(err)) throw err;
          throw new Error(
            `"${buildCommand[0]}" is not installed in your environment`
          );
        }
      }

      // Run with cached build command
      if (cachedBuildCommand) {
        try {
          return await runKustomize(cachedBuildCommand);
        } catch (err) {
          if (!isENOENTError(err)) throw err;

          // Reset cached build command on ENOENT errors
          resetCachedBuildCommand();
        }
      }

      for (const cmd of BUILD_COMMANDS) {
        try {
          const result = await runKustomize(cmd);

          // Store successful command in cache in order to make `loadKustomize`
          // runs faster after the first call.
          cachedBuildCommand = cmd;

          return result;
        } catch (err) {
          if (!isENOENTError(err)) throw err;
        }
      }

      throw new Error(
        `"loadKustomize" requires either kustomize or kubectl CLI installed in your environment. More info: https://kosko.dev/docs/components/loading-kustomize`
      );
    })();

    return loadString(stdout, { transform });
  };
}
