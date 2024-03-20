import type { ModuleFormat } from "rollup";

export const BUILD_PROD: boolean;
export const BUILD_TARGET: "browser" | "node";
export const BUILD_FORMAT: ModuleFormat;
export const TARGET_SUFFIX: string;
