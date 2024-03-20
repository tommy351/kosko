export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getRejectedValue(
  value: Promise<unknown>
): Promise<unknown> {
  try {
    await value;
    throw new Error("Promise must not be resolved");
  } catch (err) {
    return err;
  }
}
