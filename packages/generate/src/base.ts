export interface Result {
  /**
   * Generated manifests.
   */
  readonly manifests: ReadonlyArray<Manifest>;
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
