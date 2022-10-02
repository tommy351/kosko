export interface Result {
  /**
   * Generated manifests.
   */
  manifests: Manifest[];
}

export interface Manifest {
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
}
