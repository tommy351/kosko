export function validateConcurrency(value = 10): number {
  if (value < 1) {
    throw new Error("Concurrency must be greater than 0");
  }

  return value;
}
