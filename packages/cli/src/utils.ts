export function excludeFalsyInArray<T>(input: (T | undefined | null)[]): T[] {
  return input.filter(Boolean) as T[];
}
