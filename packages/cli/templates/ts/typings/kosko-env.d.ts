import "@kosko/env";

// Declare types for global environment variables
declare interface GlobalEnvironment {
  namespace: string;
}

// Declare types for component environment variables
declare interface ComponentEnvironment {
  // Fallback type of all other component variables which are not specified below
  [key: string]: unknown;

  // Specify types for each component
  nginx: {
    replicas: number;
  };
}

declare module "@kosko/env" {
  interface Environment {
    global(): GlobalEnvironment;

    component<K extends string>(
      name: K
    ): GlobalEnvironment & ComponentEnvironment[K];
  }
}
