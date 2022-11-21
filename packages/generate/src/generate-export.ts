import type { generate as _generate } from "./generate";

export type { GenerateOptions } from "./generate";

export const generate: typeof _generate = () => {
  throw new Error("generate is only supported on Node.js");
};
