import type { generate as _generate, GenerateOptions } from "./generate";

export * from "./index.base";
export type { GenerateOptions };

export const generate: typeof _generate = () => {
  throw new Error("generate is only supported on Node.js");
};
