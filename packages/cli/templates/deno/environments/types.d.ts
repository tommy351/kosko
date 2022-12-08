import "@kosko/env";

// Extend type declarations of "@kosko/env" module
declare module "@kosko/env" {
  // Declare types for global environment variables
  interface GlobalEnvironment {
    namespace: string;
  }

  // Declare types for component environment variables
  interface ComponentEnvironment {
    // Fallback type of all other component variables which are not specified below
    [key: string]: unknown;

    // Specify types for each component
    nginx: {
      replicas: number;
    };
  }

  // Extend Environment interface
  interface Environment {
    global(): Promise<GlobalEnvironment>;

    component<K extends string>(
      name: K
    ): Promise<GlobalEnvironment & ComponentEnvironment[K]>;
  }
}
