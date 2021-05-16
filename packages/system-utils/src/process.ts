import _exit from "exit";

export const args: readonly string[] = process.argv.slice(2);

export function cwd(): string {
  return process.cwd();
}

export function exit(code: number): void {
  _exit(code);
}
