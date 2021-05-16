import { handleError } from "./utils.ts";

export async function readDir(path: string): Promise<string[]> {
  const result: string[] = [];

  try {
    for await (const entry of Deno.readDir(path)) {
      result.push(entry.name);
    }
  } catch (err) {
    throw handleError(err);
  }

  return result;
}
