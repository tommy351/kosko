export interface EnvironmentConfig {
  /** External modules to require. */
  require?: ReadonlyArray<string>;
  /** Component patterns. */
  components?: ReadonlyArray<string>;
}

export interface Config extends EnvironmentConfig {
  /** Environment configs. */
  environments?: { [key: string]: EnvironmentConfig };
}
