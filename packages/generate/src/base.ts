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
export interface ComponentInfo {
  apiVersion: string;
  kind: string;
  name: string;
  namespace?: string;
}

/**
 * @public
 */
export interface BaseManifest {
  /**
   * Source path of a manifest.
   */
  path: string;

  /**
   * Source index of a manifest.
   */
  index: number[];

  /**
   * Manifest data.
   */
  data: unknown;

  /**
   * Component info.
   */
  component?: ComponentInfo;
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
