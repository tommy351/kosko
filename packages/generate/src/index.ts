import type {
  generate as _generate,
  generateAsync as _generateAsync
} from "./generate";

export * from "./index.base";

export const generate: typeof _generate = () => {
  throw new Error("generate is only supported on Node.js");
};

export const generateAsync: typeof _generateAsync = () => {
  throw new Error("generateAsync is only supported on Node.js");
};
