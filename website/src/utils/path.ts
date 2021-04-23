export function isAbsolute(path: string): boolean {
  return path.startsWith("/");
}

export function isRelative(path: string): boolean {
  return path.startsWith("./") || path.startsWith("../");
}

export function dirname(path: string): string {
  const index = path.lastIndexOf("/");
  if (index === -1) return path;
  return path.substring(0, index - 1) || "/";
}

export function extname(path: string): string {
  const index = path.lastIndexOf(".");
  if (index === -1) return "";
  return path.substring(index);
}

export function basename(path: string, ext?: string): string {
  const index = path.lastIndexOf("/");
  const base = index === -1 ? path : path.substring(index + 1);

  if (base.endsWith(ext)) {
    return base.substring(0, base.length - ext.length);
  }

  return base;
}

export function relative(from: string, to: string): string {
  const fromParts = from.split("/").filter(Boolean);
  const toParts = to.split("/").filter(Boolean);

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

  return toParts.join("/");
}
