export const sep = "/";

export function isAbsolute(path: string): boolean {
  return path.startsWith(sep);
}

export function isRelative(path: string): boolean {
  return path.startsWith(`.${sep}`) || path.startsWith(`../${sep}`);
}

export function dirname(path: string): string {
  const index = path.lastIndexOf(sep);
  if (index === -1) return ".";
  return path.substring(0, index) || sep;
}

export function extname(path: string): string {
  const index = path.lastIndexOf(".");
  if (index === -1) return "";
  return path.substring(index);
}

export function basename(path: string, ext?: string): string {
  const index = path.lastIndexOf(sep);
  const base = index === -1 ? path : path.substring(index + 1);

  if (base.endsWith(ext)) {
    return base.substring(0, base.length - ext.length);
  }

  return base;
}

export function relative(from: string, to: string): string {
  const fromParts = from.split(sep).filter(Boolean);
  const toParts = to.split(sep).filter(Boolean);

  while (fromParts[0] && toParts[0]) {
    fromParts.shift();
    toParts.shift();
  }

  while (toParts[0] === "." || toParts[0] === "..") {
    const toPart = toParts.shift();

    if (toPart === "..") {
      fromParts.pop();
    }
  }

  while (fromParts.pop()) {
    toParts.unshift("..");
  }

  return toParts.join(sep);
}
