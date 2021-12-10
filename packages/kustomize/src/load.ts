import { LoadOptions, loadString, Manifest } from "@kosko/yaml";
import {
  spawn,
  booleanArg,
  stringArg,
  stringArrayArg
} from "@kosko/exec-utils";

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
   * Enable support for exec functions (raw executables); do not use for untrusted configs! (Alpha)
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
   * Helm command (path to executable). (default `helm`)
   */
  helmCommand?: string;

  /**
   * If set to `LoadRestrictionsNone`, local kustomizations may load files from
   * outside their root. This does, however, break the relocatability of the
   * kustomization. (default `LoadRestrictionsRootOnly`)
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
   * The docker network to run the container in. (default `bridge`)
   */
  networkName?: string;

  /**
   * Reorder the resources just before output. Use `legacy` to apply a legacy
   * reordering (Namespaces first, Webhooks last, etc). Use `none` to suppress a
   * final reordering. (default `legacy`)
   */
  reorder?: string;
}

export function loadKustomize({
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
  transform
}: KustomizeOptions) {
  return async (): Promise<readonly Manifest[]> => {
    const args: string[] = [
      "build",
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

    const { stdout } = await spawn("kustomize", args);

    return loadString(stdout, { transform });
  };
}
