// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as env from "@kosko/env";

// Declare types for global environment variables
declare interface GlobalEnvironment {
  imageRegistry: string;
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

// Extend type declarations of "@kosko/env" module
declare module "@kosko/env" {
  // Extend Environment interface
  interface Environment {
    global(): GlobalEnvironment;

    component<K extends string>(
      name: K
    ): GlobalEnvironment & ComponentEnvironment[K];
  }
}
