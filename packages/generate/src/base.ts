import { type ManifestMeta } from "@kosko/common-utils";

/**
 * @public
 */
export interface Result {
  /**
   * Generated manifests.
   */
  manifests: Manifest[];
}

/**
 * @public
 */
export interface ManifestPosition {
  /**
   * Path of the source file.
   */
  path: string;

  /**
   * Index of the manifest in the source file.
   */
  index: number[];
}

/**
 * @public
 */
export interface Manifest {
  /**
   * Manifest position.
   */
  position: ManifestPosition;

  /**
   * Manifest metadata. This value is undefined when data is not a valid
   * Kubernetes object.
   */
  metadata?: ManifestMeta;

  /**
   * Manifest data. The value could be undefined when a component is invalid.
   */
  data: unknown;

  /**
   * Report an issue for a manifest. Please always use this method instead of
   * directly modifying the `issues` array to ensure better error handling.
   */
  report(issue: Issue): void;

  /**
   * Issues found in the manifest.
   */
  issues: Issue[];
}

export {
  /**
   * @deprecated Use `Manifest` instead.
   * @public
   */
  Manifest as BaseManifest,

  /**
   * @deprecated Use `Manifest` instead.
   * @public
   */
  Manifest as ManifestToValidate
};

/**
 * @public
 */
export type Severity = "error" | "warning";

/**
 * @public
 */
export interface Issue {
  severity: Severity;
  message: string;
  cause?: unknown;
}
