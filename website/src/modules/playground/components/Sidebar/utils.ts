export function isValidName(value: string): boolean {
  return /^[\w-_.]+$/.test(value);
}
