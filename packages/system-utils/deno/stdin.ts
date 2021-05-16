import { readAll } from "https://deno.land/std@0.96.0/io/mod.ts";

export async function getStdin(): Promise<string> {
  const content = await readAll(Deno.stdin);
  return new TextDecoder().decode(content);
}
