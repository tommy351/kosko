import env, { Environment as BaseEnvironment } from "npm:@kosko/env";

// Declare types for global environment variables
export interface GlobalEnvironment {
  namespace: string;
}

// Declare types for component environment variables
export interface ComponentEnvironment {
  // Fallback type of all other component variables which are not specified below
  [key: string]: unknown;

  // Specify types for each component
  nginx: {
    replicas: number;
  };
}

// Extend Environment interface
export interface Environment extends BaseEnvironment {
  global(): Promise<GlobalEnvironment>;

  component<K extends string>(
    name: K
  ): Promise<GlobalEnvironment & ComponentEnvironment[K]>;
}

export default env as Environment;
