import p from "path";

export function joinPath(...paths: string[]): string {
  return p.join(...paths);
}

export function isAbsolutePath(path: string): boolean {
  return p.isAbsolute(path);
}

export function resolvePath(...paths: string[]): string {
  return p.resolve(...paths);
}
