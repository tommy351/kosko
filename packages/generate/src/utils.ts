import { cpus } from "node:os";

function getCPUCores(): number {
  // eslint-disable-next-line no-restricted-globals
  if (process.env.BUILD_TARGET === "node") {
    return cpus().length;
  }

  return Infinity;
}

export function validateConcurrency(value = getCPUCores()): number {
  if (value < 1) {
    throw new Error("Concurrency must be greater than 0");
  }

  return value;
}
