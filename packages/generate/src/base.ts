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
   * Manifest data.
   */
  data: any;
}
