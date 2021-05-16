import p from "path";

export function joinPath(...paths: string[]): string {
  return p.join(...paths);
}
