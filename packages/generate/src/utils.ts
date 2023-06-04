import assert from "node:assert";
import { cpus } from "node:os";

function getCPUCores(): number {
  // eslint-disable-next-line no-restricted-globals
  if (process.env.BUILD_TARGET === "node") {
    return cpus().length;
  }

  return Infinity;
}

export function validateConcurrency(value = getCPUCores()): number {
  assert(value > 0, "Concurrency must be greater than 0");

  return value;
}
