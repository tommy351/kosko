export interface EnvironmentConfig {
  /** External modules to require. */
  readonly require?: ReadonlyArray<string>;
  /** Component patterns. */
  readonly components?: ReadonlyArray<string>;
}

export interface Config extends EnvironmentConfig {
  /** Environment configs. */
  readonly environments?: {
    readonly [key: string]: EnvironmentConfig;
  };

  /** Customize paths. */
  readonly paths?: {
    readonly environment?: {
      /** Path to global environment files. */
      readonly global?: string;
      /** Path to component environment files. */
      readonly component?: string;
    };
  };

  /** File extensions of components. */
  readonly extensions?: ReadonlyArray<string>;
}
