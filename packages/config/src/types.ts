export interface EnvironmentConfig {
  /** External modules to require. */
  readonly require?: ReadonlyArray<string>;
  /** Component patterns. */
  readonly components?: ReadonlyArray<string>;
}

export interface Config extends EnvironmentConfig {
  /** Environment configs. */
  readonly environments?: { [key: string]: EnvironmentConfig };
}
