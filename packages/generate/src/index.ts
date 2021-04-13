import type { generate as _generate } from "./generate";

export * from "./index.base";

export const generate: typeof _generate = () => {
  throw new Error("generate is only supported on Node.js");
};
