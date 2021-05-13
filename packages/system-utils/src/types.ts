export interface Stats {
  isFile: boolean;
  isDirectory: boolean;
  isSymbolicLink: boolean;
  size: number;
}

export class NotFoundError extends Error {
  public constructor(message = "No such file or directory") {
    super(message);
  }
}

export interface GlobOptions {
  cwd?: string;
  onlyFiles?: boolean;
}

export interface GlobEntry {
  relativePath: string;
  absolutePath: string;
}
