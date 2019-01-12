export interface EnvironmentConfig {
  require?: ReadonlyArray<string>;
  components?: ReadonlyArray<string>;
}

export interface Config extends EnvironmentConfig {
  environments?: { [key: string]: EnvironmentConfig };
}
