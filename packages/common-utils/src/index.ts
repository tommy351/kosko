/**
 * Common utilities used in Kosko.
 *
 * @packageDocumentation
 */

/**
 * Returns true when type of `value` is `object` and is not `null`, `undefined` or
 * an array.
 *
 * @public
 */
export function isRecord(
  value: unknown
): value is Record<string | symbol, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Transforms `input` into an array, or leave it as-is if `input` is already an array.
 *
 * @public
 */
export function toArray<T>(input: T | T[]): T[] {
  return Array.isArray(input) ? input : [input];
}

/**
 * Returns `code` of an error-like object.
 *
 * @public
 */
export function getErrorCode(err: unknown): string | undefined {
  if (isRecord(err) && typeof err.code === "string") {
    return err.code;
  }
}

/**
 * Returns the group part of an Kubernetes API version string.
 *
 * @public
 */
export function apiVersionToGroup(apiVersion: string): string {
  const index = apiVersion.lastIndexOf("/");

  return index === -1 ? "" : apiVersion.substring(0, index);
}

/**
 * @public
 */
export interface ManifestMeta {
  apiVersion: string;
  kind: string;
  name: string;
  namespace?: string;
}

/**
 * Returns metadata from a Kubernetes manifest. Returns `undefined` if `value`
 * is not a valid manifest.
 *
 * @public
 */
export function getManifestMeta(value: unknown): ManifestMeta | undefined {
  if (!isRecord(value)) return;

  const { apiVersion, kind, metadata } = value;

  if (
    typeof apiVersion !== "string" ||
    typeof kind !== "string" ||
    !isRecord(metadata) ||
    typeof metadata.name !== "string"
  ) {
    return;
  }

  return {
    apiVersion,
    kind,
    name: metadata.name,
    ...(typeof metadata.namespace === "string" && {
      namespace: metadata.namespace
    })
  };
}
