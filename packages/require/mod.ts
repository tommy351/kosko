import { createRequire } from "https://deno.land/std@0.95.0/node/module.ts";
import type mod from "./index";

const require = createRequire(import.meta.url);

export const isESMSupported: typeof mod.isESMSupported = async () => true;

export const importPath: typeof mod.importPath = (path) => import(path);

export const requireDefault: typeof mod.requireDefault = (path) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require(path);
  return mod && mod.__esModule ? mod.default : mod;
};

export const resolve: typeof mod.resolve = (id, options) => {
  throw new Error("resolve is not supported on Deno currently");
};

export const resolveESM: typeof mod.resolveESM = (id, options) => {
  throw new Error("resolveESM is not supported on Deno currently");
};

export const getRequireExtensions: typeof mod.getRequireExtensions = () => [
  ".ts",
  ".js",
  ".json"
];

export type { ResolveOptions } from "./index";
