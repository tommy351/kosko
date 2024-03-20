import type { ManifestMeta } from "@kosko/common-utils";

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
export interface BaseManifest {
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
   * Manifest data.
   */
  data: unknown;
}

/**
 * @public
 */
export interface ManifestToValidate extends BaseManifest {
  /**
   * Report an issue for a manifest. Please always use this method instead of
   * directly modifying the `issues` array to ensure better error handling.
   */
  report(issue: Issue): void;
}

/**
 * @public
 */
export interface Manifest extends BaseManifest {
  /**
   * Issues found in the manifest.
   */
  issues: Issue[];
}

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
